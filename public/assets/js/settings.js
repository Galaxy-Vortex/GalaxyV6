const currentSiteUrl = window.location.origin ;
function launchBlob() {
  const htmlContent = `
    <html>
      <head>
            <title>Classroom</title>
            <link rel="icon" type="image/x-icon" href="https://ssl.gstatic.com/classroom/favicon.png">
        <style>
          body,
          html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
          }
          iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${currentSiteUrl}/x.html"></iframe>
      </body>
    </html>
	`;

  const blob = new Blob([htmlContent], {
    type: "text/html",
  });

  const blobUrl = URL.createObjectURL(blob);

  let newWindow = window.open(blobUrl);
}

function aboutBlank() {
  var y = window.open("about:blank#", "_blank");
  y.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
            <title>Classroom</title>
            <link rel="icon" type="image/x-icon" href="https://ssl.gstatic.com/classroom/favicon.png">
        </head>
        <body>
          <iframe src="${currentSiteUrl}/x.html"></iframe>
        </body>
        <style>
    body,iframe {
    background: #000;

    height: 100vh;
    width: 100vw;
    overflow: hidden;
    border: 0px;
    margin: 0px;
    }
    </style>
      </html>
    `);
  y.document.close();
}
const blobChecked = document.getElementById("autoBlob");
const aboutChecked = document.getElementById("autoAbout");

function checkAutoStatus() {
  console.log("Checkbox clicked");
  localStorage.setItem("autoBlob", blobChecked.checked);
  localStorage.setItem("autoAbout", aboutChecked.checked);
}
function loadAutoStatus() {
  console.log("Loading auto status");
  blobChecked.checked = localStorage.getItem("autoBlob") == "true";
  aboutChecked.checked = localStorage.getItem("autoAbout") == "true";
}
window.addEventListener("load", loadAutoStatus);

function loadTitleAndFavicon() {
  const savedTitle = localStorage.getItem("pageTitle");
  const savedFavicon = localStorage.getItem("pageFavicon");
  if (savedTitle || savedFavicon) {
    if (savedTitle) document.title = savedTitle;
    if (savedFavicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = savedFavicon;
    }
  }
}

function updateName() {
  const nameInput = document.getElementById("nameInput");

  nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      localStorage.setItem("name", nameInput.value);
      console.log("Name saved:", nameInput.value);
    }
  });
}

updateName();
let backgroundURL = localStorage.getItem("backgroundURL");

function setDefaultBackground(url) {
  localStorage.setItem("backgroundURL", url);
  backgroundURL = localStorage.getItem("backgroundURL");
  document.documentElement.style.setProperty("--backgroundURL", `url(${url})`);
}
const DB_NAME = "WebsiteSettingsDB";
const STORE_NAME = "backgrounds";
const KEY = "userBackground";

function openWebsiteDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);

    req.onsuccess = () => resolve(req.result);
  });
}

async function useStore(mode, cb) {
  const db = await openWebsiteDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = cb(store);
    tx.oncomplete = () => resolve(req.result);
  });
}

async function setBackground(fileBlob) {
  await useStore("readwrite", (s) => s.put(fileBlob, KEY));
  await applyBackgroundFromDB();
}

async function applyBackgroundFromDB() {
  const blob = await useStore("readonly", (s) => s.get(KEY));
  if (blob) {
    const url = URL.createObjectURL(blob);
    console.log("UPLOADED URL: " + url);
    localStorage.setItem("backgroundURL", url);
    document.documentElement.style.setProperty(
      "--backgroundURL",
      `url(${url})`
    );
  }
}

const uploadDiv = document.getElementById("uploaddiv");
const fileInput = document.getElementById("fileInput");

if (uploadDiv && fileInput) {
  uploadDiv.onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file?.type.startsWith("image/")) setBackground(file);
  };
}

function setProxyType(x) {
  localStorage.setItem("proxyType", x);
  loadingShow("Set to " + x);
}
function setSearchEngine(z) {
  localStorage.setItem("searchEngine", z);
  loadingShow("Saved");
}

const glassmorphismSlider = document.getElementById("glassmorphism-slider");
glassmorphismSlider.addEventListener("input", updateGlassmorphismDarkness);
function updateGlassmorphismDarkness() {
  const opacityValue = glassmorphismSlider.value;
  localStorage.setItem("glassDarknessStore", opacityValue);
  const newGlassmorphismBG = `rgba(14, 13, 13, ${opacityValue})`;
  document.documentElement.style.setProperty(
    "--glassmorphismBG",
    newGlassmorphismBG
  );
}
function loadGlassmorphismState() {
  const storedOpacity = localStorage.getItem("glassDarknessStore") || "0.432";
  glassmorphismSlider.value = storedOpacity;
  updateGlassmorphismDarkness();
}
window.addEventListener("load", loadGlassmorphismState);



function antiClose() {
  if (antiCloseButton.checked) {
    window.addEventListener("beforeunload", function (event) {
      event.preventDefault();
      event.returnValue = "This message prevents teachers from closing the tab";
    });
    localStorage.setItem("checkAntiClose", "true");
    console.log("Turned On");
  } else {
    localStorage.setItem("checkAntiClose", "false");
    console.log("Turned Off");
  }
}
function loadAntiClose() {
  antiCloseButton.checked = localStorage.getItem("checkAntiClose") == "true";
  if (antiCloseButton.checked) {
    window.addEventListener("beforeunload", function (event) {
      event.preventDefault();
      event.returnValue = "This message prevents teachers from closing the tab";
    });
    localStorage.setItem("checkAntiClose", "true");
    console.log("Turned On");
  } else {
    localStorage.setItem("checkAntiClose", "false");
    console.log("Turned Off");
  }
}
window.addEventListener("load", loadAntiClose);
function updateTitleAndFavicon(titleName, faviconURL) {
  localStorage.setItem("pageTitle", titleName);
  localStorage.setItem("pageFavicon", faviconURL);
  document.title = titleName;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = faviconURL;
}
let loadingNotice = document.createElement("div");
function loadingShow(text) {
  loadingNotice.className = "notice";
  loadingNotice.textContent = text;
  loadingNotice.style.animation = "noticeShow 0.4s ease forwards";
  loadingNotice.addEventListener("animationend", function () {
    loadingHide();
  });

  document.body.appendChild(loadingNotice);
  console.log("Final URL:", input.value);
}
function loadingHide() {
  loadingNotice.style.animation = "noticeHide 0.4s ease 1s forwards";
}

function copy(URLLink) {
  const message = URLLink;
  navigator.clipboard
    .writeText(message)
    .then(() => {
      loadingShow("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}
