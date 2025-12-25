import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";
import("../../glass/glassJS.config.js");
// holy shit this file is so messy

let iframe;
let protocol = location.protocol === "https:" ? "wss://" : "ws://";
let host = location.host;
let transportx;
const bar = document.getElementById("bar");
let progress = 0;

if (localStorage.getItem("transportType") == null) {
  localStorage.setItem("transportType", "libcurl");
  transportx = "libcurl";
} else {
  transportx = localStorage.getItem("transportType");
}
setTransport(transportx);
console.log(transportx);
setWisp(`${protocol}${host}/wisp/`);
const uvList = ["https://discord.com"];
document.addEventListener("keyup", async (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
        setTimeout(() => (bar.style.width = "0%"), 300);
        progress = 0;

    let tabNumber = activeTabId.replace("tab", "");
    iframe = document.getElementById("frame" + tabNumber);
    if (
      input.value.trim().includes("https://") &&
      !input.value.trim().includes(".")
    ) {
      input.value = localStorage
        .getItem("searchEngine")
        .replace("%s", input.value);
    } else if (
      input.value.trim().includes(".") &&
      !input.value.trim().startsWith("http://") &&
      !input.value.trim().startsWith("https://")
    ) {
      input.value = "https://" + input.value;
    }
    let loadingNotice = document.createElement("div");
    function loadingShow(text) {
      loadingNotice.className = "notice";
      loadingNotice.style.animation = "noticeShow 0.4s forwards";
      loadingNotice.textContent = text;
      document.body.appendChild(loadingNotice);
      console.log("Final URL:", input.value);
    }
    function loadingHide() {
      loadingNotice.textContent = "Done!";
      loadingNotice.style.animation = "noticeHide 0.4s ease 0.3s forwards";
    }

    loadingNotice.addEventListener("click", function () {
      loadingNotice.style.animation = "noticeHide 0.4s forwards";
    });
    let url = input.value;
    let proxyType = localStorage.getItem("proxyType"); //Checks if link includes geforce
    if (url.includes("nvidia") || url.includes("geforce")) {
      let geforceNotice = document.createElement("div");
      geforceNotice.className = "notice";
      geforceNotice.style.animation = "noticeShow 0.4s forwards";
      geforceNotice.textContent =
        "Open GeForce in dock bar for it to work (click to close)";
      document.body.appendChild(geforceNotice);
      console.log("Final URL:", input.value);
      console.log("nvidia");
      geforceNotice.addEventListener("click", function () {
        console.log("CLOSING");
        geforceNotice.style.animation = "noticeHide 0.4s forwards";
      });
    } else if (proxyType == null || proxyType == "Auto") {
      proxyType = "Auto";
      const match = uvList.findIndex((base) => input.value.startsWith(base)); // Checks if link includes discord
      if (match == -1) {
        console.log("loading SJ");
        url = await proxySJ(makeURL(input.value));
        loadingShow("Loading...");
      } else {
        console.log("loading UV");
        url = await proxyUV(makeURL(input.value));
        loadingShow("Loading...");
      }
    } else if (proxyType === "SJ") {
      // Regular
      url = await proxySJ(makeURL(input.value));
      loadingShow("Loading...");
      console.log("set to SJ");
    } else if (proxyType === "UV") {
      url = await proxyUV(makeURL(input.value));
      loadingShow("Loading...");
      console.log("set to UV");
    }
    iframe.src = url;
    if (proxyType === "SJ") {
      updateIframeTitle();
    } else if (proxyType === "UV") {
      updateIframeTitle();
    } else {
      updateIframeTitle();
    }
    if (proxyType === "SJ") {
      input.value = getOriginalUrl(iframe.src);
    } else if (proxyType === "UV") {
      updateIframeTitle();
      input.value = __uv$config.decodeUrl(
        iframe.src.split(__uv$config.prefix)[1]
      );
    } else {
      input.value = getOriginalUrl(iframe.src);
    }

    console.log("Loading URL in", iframe.id, ":", url);
    let currentTab = document.getElementById("tab" + tabNumber);
    let tabName = currentTab?.querySelector(".tabName");
    function updateIframeTitle() {
      iframe = document.getElementById(
        "frame" + activeTabId.replace("tab", "")
      );
      console.log("Updating title for iframe:", iframe.id);
      iframe.onload = () => {
        loadingHide();
        try {
          tabName.textContent =
            iframe.contentDocument?.title + " (" + proxyType + ")" ||
            "Untitled";
        } catch {
          tabName.textContent = "Cross-origin page";
        }
      };
      const fakeLoad = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 8;
          bar.style.width = progress + "%";
        }
      }, 200);

      iframe.addEventListener("load", () => {
        clearInterval(fakeLoad);
        bar.style.width = "100%";
        setTimeout(() => (bar.style.width = "0%"), 300);
        progress = 0;
      });
    }
  }
});

function bugReports() {
  newTab();
  let tabNumber = activeTabId.replace("tab", "");
  iframe = document.getElementById("frame" + tabNumber);
  iframe.src = "/report.html";
}
window.bugReports = bugReports;
