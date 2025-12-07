import { createServer } from "node:http";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const PORT = process.env.PORT || 1010;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "production";
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

const fastify = Fastify({
  trustProxy: true, // <-- important if behind Caddy/Nginx
  serverFactory: (handler) => {
    return createServer()
      .on("request", (req, res) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        handler(req, res);
      })
      .on("upgrade", (req, socket, head) => {
        if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
        else socket.end();
      });
  },
  logger: NODE_ENV === "development",
});
fastify.addHook("onRequest", async (req, reply) => {
  const time = new Date().toISOString();

  const log = {
    time,
    method: req.method,
    ip: req.ip,
    ips: req.ips,
    hostname: req.hostname,
    url: req.url,
  };

  if (req.body) {
    log.body = req.body;
  }

  console.log("Incoming Request →", JSON.stringify(log, null, 2));
});

// Load blocked.json (assume it’s an array of IPs)
const blockedIPs = new Set(
  JSON.parse(fs.readFileSync("src/blocked.json", "utf-8"))
);

fastify.addHook("onRequest", async (req, reply) => {
  const ip = req.ip;

  if (blockedIPs.has(ip)) {
    reply.code(403).send({ error: "Forbidden" });
    return reply;
  }
});

fastify.register(fastifyStatic, {
  root: publicDir,
  prefix: "/",
  decorateReply: true,
});

fastify.get("/", (req, reply) => {
  return reply.sendFile("index.html", publicDir);
});

fastify.get("/favicon-proxy", async (req, reply) => {
  try {
    const { url } = req.query;

    if (!url) {
      return reply.code(400).send({ error: "URL parameter is required" });
    }

    const validServices = [
      "www.google.com/s2/favicons",
      "icons.duckduckgo.com/ip3",
      "favicons.githubusercontent.com",
    ];

    const urlObj = new URL(url);
    const isValidService = validServices.some(
      (service) =>
        urlObj.hostname + urlObj.pathname.split("/")[1] ===
          service.split("/")[0] || urlObj.href.includes(service)
    );

    if (!isValidService) {
      return reply.code(403).send({ error: "Invalid favicon service" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Glint-Browser/1.0",
        Accept: "image/*,*/*;q=0.8",
      },
      timeout: 5000,
    });

    if (!response.ok) {
      return reply
        .code(response.status)
        .send({ error: "Failed to fetch favicon" });
    }

    const contentType = response.headers.get("content-type") || "image/x-icon";
    const imageBuffer = await response.arrayBuffer();

    reply.header("Content-Type", contentType);
    reply.header("Cache-Control", "public, max-age=86400");
    reply.header("Access-Control-Allow-Origin", "*");

    return reply.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Favicon proxy error:", error);
    return reply.code(500).send({ error: "Internal server error" });
  }
});

fastify.register(fastifyStatic, {
  root: epoxyPath,
  prefix: "/epoxy/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: baremuxPath,
  prefix: "/baremux/",
  decorateReply: false,
});

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({ error: "Internal Server Error" });
});

async function shutdown() {
  try {
    await fastify.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  const address = fastify.server.address();
  console.log(`Server running in ${NODE_ENV} mode`);
  console.log(`Listening on:`);
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  if (address.family === "IPv6") {
    console.log(`\thttp://[${address.address}]:${address.port}`);
  } else {
    console.log(`\thttp://${address.address}:${address.port}`);
  }
});

fastify.post("/report-bug", async (req, reply) => {
  const { name, bug, url, ip } = req.body;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `# New Bug Report!`,
        embeds: [
          {
            title: "Bug Report",
            type: "rich",
            color: 0xff0000,
            fields: [
              { name: "Report Type:", value: name, inline: true },
              { name: "Description:", value: bug },
              { name: "Page URL:", value: url },
              { name: "From:", value: ip }, 
            ],
            footer: { text: "Galaxy Bug Report" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (response.ok) {
      return reply.send({ status: "ok" });
    } else {
      return reply.code(500).send({ error: "Failed to send bug report" });
    }
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
});

fastify.get("/allow", async (req, reply) => {
  return reply.code(200).send({ status: "allowed" });
});
