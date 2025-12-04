import { openApp, loadingShow, loadingHide } from "/assets/js/openapps.js";
import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";
function launchApp() {
  let appURL = localStorage.getItem("storeAppURL");
  if (appURL == "https://shorturl.at/IG5Dl") {
    openApp(appURL, "UV");
    frame.style.zIndex = "1";
  } else {
    const currentSiteUrl =
      "/scramjet/https%3A%2F%2Fplay.geforcenow.com%2Fmall%2F#%2Floginwall";
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("frame").src = currentSiteUrl;
    });
  }
}
window.addEventListener("load", launchApp);
launchApp();
