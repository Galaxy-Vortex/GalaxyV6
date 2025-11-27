const currentSiteUrl = window.location.origin + "?redirect=true";
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
        <iframe src="${currentSiteUrl}"></iframe>
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
          <iframe src="/"></iframe>
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

//The blob/about:blank will be executed in mainAnimation.js

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

function setBackground(bg) {
  localStorage.setItem("backgroundURL", bg);
  backgroundURL = localStorage.getItem("backgroundURL");
  document.documentElement.style.setProperty(
    "--backgroundURL",
    `url(${backgroundURL})`
  );
}
function setProxyType(x) {
  localStorage.setItem("proxyType", x);
}
function setSearchEngine(z) {
  localStorage.setItem("searchEngine", z);
}
const uploadDiv = document.getElementById("uplaoddiv");
const fileInput = document.getElementById("fileInput");
let file;
uploadDiv.addEventListener("click", () => {
  fileInput.click();
  file = "";
});
fileInput.addEventListener("change", () => {
  file = fileInput.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      const uploadedimg = reader.result;
      localStorage.setItem("backgroundURL", uploadedimg);
      backgroundURL = uploadedimg;
      document.documentElement.style.setProperty(
        "--backgroundURL",
        `url(${backgroundURL})`
      );
    };
    reader.readAsDataURL(file);
  }
});
const glassToggle = document.getElementById("toggleGlassmorphism");

function glassToggleButton() {
  console.log("Checkbox clicked");
  localStorage.setItem("glassToggleStore", glassToggle.checked);
  if (glassToggle.checked) {
    document.documentElement.style.setProperty(
      "--glassmorphismBG",
      `rgba(0, 0, 0, 1)`
    );
  } else {
    document.documentElement.style.removeProperty("--glassmorphismBG");
  }
}
function loadGlassToggle() {
  console.log("Loading auto status");
  glassToggle.checked = localStorage.getItem("glassToggleStore") == "true";
  if (glassToggle.checked) {
    document.documentElement.style.setProperty(
      "--glassmorphismBG",
      `rgba(0, 0, 0, 1)`
    );
  } else {
    document.documentElement.style.removeProperty("--glassmorphismBG");
  }
}
window.addEventListener("load", loadGlassToggle);
