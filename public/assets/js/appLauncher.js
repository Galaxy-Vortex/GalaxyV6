import { openApp, loadingShow, loadingHide } from "/assets/js/openapps.js";
import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";
const response = await fetch("https://api.ipify.org?format=json");
const data = await response.json();
const ip = data.ip;
const firstThree = ip.split(".")[0];
console.log("Full IP:", ip);
console.log("First 3 digits:", firstThree);

function launchApp() {
  let appURL = localStorage.getItem("storeAppURL");
  if (appURL == "https://shorturl.at/IG5Dl") {
    openApp(appURL, "UV");
    frame.style.zIndex = "1";
  } else if (appURL == "xz") {
    let appURLx = "https://" + firstThree + ".ip.nowgg.fun/apps/a/19900/b.html"
    console.log(appURLx)
    openApp(appURLx, "SJ");
    frame.style.zIndex = "1";
  }
          const iframe = document.getElementById("frame");
      const bar = document.getElementById("bar");

      let progress = 0;
      const fakeLoad = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 8;
          bar.style.width = progress + "%";
        }
      }, 200);
      iframe.addEventListener("load", () => {
        clearInterval(fakeLoad);
        bar.style.width = "100%";
        setTimeout(() => loader.remove(), 300);
      });
}

window.addEventListener("load", launchApp);
launchApp();
  