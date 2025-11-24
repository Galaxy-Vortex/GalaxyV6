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
  openApp(appURL, "UV");
  frame.style.zIndex = "1";
}
window.addEventListener("load", launchApp);
launchApp() 