let nav = document.getElementById("tabGroup");
let body = document.getElementById("body");
let tabCount = 1;
let tabNumber = 0;
let activeTabId = null;
let input = document.getElementById("rogoisdabest");

function setActiveTab(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  activeTabId = tab.id;
  document
    .querySelectorAll(".frame")
    .forEach((f) => (f.style.display = "none"));
  let iframe = document.getElementById("frame" + tab.id.replace("tab", ""));
  iframe.style.display = "block";

  input.value = getOriginalUrl(iframe.src);
}
function newTab() {
  tabNumber++;
  let tab = document.createElement("div");
  let divider = document.createElement("div");
  let iframe = document.createElement("iframe");

  if (tabNumber >= 2) {
    divider.className = "divider";
    divider.textContent = "|";
    nav.appendChild(divider);
  }

  iframe.className = "frame";
  iframe.id = "frame" + tabCount;

  tab.className = "tab";
  tab.id = "tab" + tabCount;
  tab.innerHTML = `
    <img src="../assets/img/icons/browser.png" alt="" class="favicon">
    <p class="tabName">New Tab</p>
    <p class="close">&#xEF2C</p>`;

  nav.appendChild(tab);
  tab.style.animation = "openTab 0.3s  forwards";
  body.appendChild(iframe);

  tab.addEventListener("click", () => setActiveTab(tab));
  let closeBtn = tab.querySelector(".close");
  closeBtn.addEventListener("click", (e) => {
    tab.style.animation = "closeTab 0.1s ";
    tabNumber--;
    tab.addEventListener("animationend", () => {
      e.stopPropagation();
      tab.remove();
      divider.remove();
      iframe.remove();
      input.value = "";
      if (activeTabId === tab.id) {
        let remainingTabs = document.querySelectorAll(".tab");
        if (remainingTabs.length > 0)
          setActiveTab(remainingTabs[remainingTabs.length - 1]);
      }
    });
  });
  tab.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
      tab.style.animation = "closeTab 0.1s ";
      tabNumber--;
      tab.addEventListener("animationend", () => {
        e.stopPropagation();
        tab.remove();
        divider.remove();
        iframe.remove();
        input.value = "";
        if (activeTabId === tab.id) {
          let remainingTabs = document.querySelectorAll(".tab");
          if (remainingTabs.length > 0)
            setActiveTab(remainingTabs[remainingTabs.length - 1]);
        }
      });
    }
  });
  tabCount++;
  setActiveTab(tab);
}

newTab();

function getOriginalUrl(url) {
  if (!url) return "";

  if (url.includes("/scramjet/") && url.includes(location.origin)) {
    try {
      let urlObj = new URL(url);
      if (urlObj.pathname.startsWith("/scramjet/")) {
        let encodedUrl = urlObj.pathname.substring("/scramjet/".length);
        try {
          console.log("URL: " + encodedUrl);
          let decoded = decodeURIComponent(encodedUrl);
          if (decoded.startsWith("http")) {
            return decoded;
          }
          let base64Decoded = atob(encodedUrl);
          if (base64Decoded.startsWith("http")) {
            return base64Decoded;
          }
        } catch (e) {}
      }
    } catch (e) {}
  } else {
    let decoded = __uv$config.decodeUrl(url.split(__uv$config.prefix)[1]);
    return decoded;
  }
  return url;
}
async function bugReports() {
  newTab();
  input.value = "https://forms.gle/rK5gcpLTwPGreqXs6";
  input.dispatchEvent(
    new KeyboardEvent("keyup", { key: "Enter", keyCode: 13, bubbles: true })
  );
}
