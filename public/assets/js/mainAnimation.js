if (localStorage.getItem("onboarding") == null) {
  location.href = "onboarding/";
}

let UserName = localStorage.getItem("name");
let backgroundURL = localStorage.getItem("backgroundURL");

if (backgroundURL == null) {
  localStorage.setItem("backgroundURL", "../img/bg3.png");
}
backgroundURL = localStorage.getItem("backgroundURL");

document.documentElement.style.setProperty(
  "--backgroundURL",
  `url(${backgroundURL})`
);

gsap.fromTo(
  ".navStagger",
  { y: 30, opacity: 0 },
  { duration: 0.4, y: 0, opacity: 1, stagger: 0.1 }
);

let zindex = 0;

function openWindow(windowSrc) {
  const windowEl = document.createElement("div");
  const iframe = document.createElement("iframe");
  let windowValue = "1";

  windowEl.className = "window";
  windowEl.style.position = "absolute";
  windowEl.style.left = "25%";
  windowEl.style.top = "25%";
  windowEl.style.zIndex = ++zindex;

  windowEl.innerHTML = `
    <div class="windowTop">
      <div class="windowMove"></div>
      <div class="windowControls">
        <div class="minimize windowcontrolicon">
          <img src="assets/img/icons/minimize-sign.png" class="windowIcons" />
        </div>
        <div class="square windowcontrolicon">
          <img src="assets/img/icons/stop.png" class="windowIcons" id="square" />
          <img src="assets/img/icons/layers.png" class="windowIcons" id="squares" />
        </div>
        <div class="closeIcon windowcontrolicon windowcontroliconred">
          <img src="assets/img/icons/close.png" class="windowIcons" />
        </div>
      </div>
    </div>

    <!-- NEW: 4 corner resize handles -->
    <div class="resize-handle resize-top-left"></div>
    <div class="resize-handle resize-top-right"></div>
    <div class="resize-handle resize-bottom-left"></div>
    <div class="resize-handle resize-bottom-right"></div>
  `;

  // control buttons
  const squareBtn = windowEl.querySelector(".square");
  const closeBtn = windowEl.querySelector(".closeIcon");
  const minimizeBtn = windowEl.querySelector(".minimize");

  squareBtn.addEventListener("click", changeIcon);
  closeBtn.addEventListener("click", closeWindow);
  minimizeBtn.addEventListener("click", minimizeWindow);

  // iframe
  iframe.className = "windowFrame";
  iframe.src = windowSrc;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  windowEl.appendChild(iframe);
  document.body.appendChild(windowEl);

  const controls = windowEl.querySelector(".windowMove");
  const handles = windowEl.querySelectorAll(".resize-handle");
controls.addEventListener("dblclick", () => {
  changeIcon(); 
});

  let isDragging = false;
  let isResizing = false;
  let currentHandle = null;
  let offset = { x: 0, y: 0 };
  const allIframes = document.querySelectorAll(".windowFrame");

  // -------------- DRAGGING -----------------
  controls.addEventListener("mousedown", (e) => {
    windowEl.style.transition = "0s";
    if (windowValue === "1") {
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    } else {
      changeIcon();
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));

      windowEl.style.transition = "0s";
      windowEl.style.top = "0px";
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    }
  });
  // -------------- RESIZING (4 corners) -----------------
  handles.forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;
      currentHandle = handle;
      offset.x = e.clientX;
      offset.y = e.clientY;
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      windowEl.style.transition = "0s";
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - windowEl.offsetHeight;

      windowEl.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
      windowEl.style.top = Math.max(0, Math.min(newY, maxY)) + "px";
    }

    if (isResizing) {
      const dx = e.clientX - offset.x;
      const dy = e.clientY - offset.y;

      let newWidth = windowEl.offsetWidth;
      let newHeight = windowEl.offsetHeight;
      let newLeft = windowEl.offsetLeft;
      let newTop = windowEl.offsetTop;

      if (currentHandle.classList.contains("resize-bottom-right")) {
        newWidth += dx;
        newHeight += dy;
      }
      if (currentHandle.classList.contains("resize-bottom-left")) {
        newWidth -= dx;
        newLeft += dx;
        newHeight += dy;
      }
      if (currentHandle.classList.contains("resize-top-right")) {
        newWidth += dx;
        newHeight -= dy;
        newTop += dy;
      }
      if (currentHandle.classList.contains("resize-top-left")) {
        newWidth -= dx;
        newLeft += dx;
        newHeight -= dy;
        newTop += dy;
      }

      newWidth = Math.max(200, newWidth);
      newHeight = Math.max(150, newHeight);

      windowEl.style.width = newWidth + "px";
      windowEl.style.height = newHeight + "px";
      windowEl.style.left = newLeft + "px";
      windowEl.style.top = newTop + "px";

      offset.x = e.clientX;
      offset.y = e.clientY;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
    allIframes.forEach((f) => (f.style.pointerEvents = "auto"));
  });

  // -------------- MAXIMIZE / RESTORE -----------------
  let square = windowEl.querySelector("#square");
  let squares = windowEl.querySelector("#squares");

  function changeIcon() {
    windowEl.style.transition =
      "width 0.3s ease, height 0.3s ease, left 0.3s ease, top 0.3s ease";

    if (windowValue === "1") {
      square.style.display = "none";
      squares.style.display = "flex";
      windowValue = "0";

      windowEl.style.left = "0px";
      windowEl.style.top = "0px";
      windowEl.style.width = "100%";
      windowEl.style.height = "calc(100% - 40px)";
    } else {
      squares.style.display = "none";
      square.style.display = "flex";
      windowValue = "1";

      windowEl.style.left = "500px";
      windowEl.style.top = "200px";
      windowEl.style.width = "900px";
      windowEl.style.height = "500px";
    }
  }

  // -------------- CLOSE -----------------
  function closeWindow() {
    windowEl.style.animation = "closeWindow 0.2s ease forwards";
    windowEl.addEventListener("animationend", () => {
      windowEl.remove();
    });
  }

  // -------------- MINIMIZE -----------------
  function minimizeWindow() {
    const minimizedContainer = document.getElementById("minimizedContainer");
    const icon = document.createElement("div");
    icon.className = "minimizedWindowIcon";
    minimizedContainer.appendChild(icon);

    const rect = icon.getBoundingClientRect();

    windowEl.style.transition = "all 0.3s ease";
    windowEl.style.width = rect.width + "px";
    windowEl.style.height = rect.height + "px";
    windowEl.style.left = rect.left + "px";
    windowEl.style.top = rect.top + "px";
    windowEl.style.opacity = "0";

    setTimeout(() => (windowEl.style.display = "none"), 300);

    const preview = document.createElement("div");
    preview.className = "minimizedPreview";
    preview.innerHTML = windowEl.innerHTML;
    document.body.appendChild(preview);

    icon.addEventListener("mouseenter", (e) => {
      preview.style.left = e.clientX + "px";
      preview.style.top = e.clientY - preview.offsetHeight - 10 + "px";
      preview.style.opacity = "1";
    });

    icon.addEventListener("mousemove", (e) => {
      preview.style.left = e.clientX + "px";
      preview.style.top = e.clientY - preview.offsetHeight - 10 + "px";
    });

    icon.addEventListener("mouseleave", () => {
      preview.style.opacity = "0";
    });

    icon.addEventListener("click", () => {
      windowEl.style.display = "flex";
      windowEl.style.transition = "all 0.3s ease";
      windowEl.style.width = "900px";
      windowEl.style.height = "500px";
      windowEl.style.left = "25%";
      windowEl.style.top = "25%";
      windowEl.style.opacity = "1";
      windowEl.style.zIndex = ++zindex;

      icon.remove();
      preview.remove();
    });
  }
}
const currentSiteUrl = window.location.href + "?redirect=true";
function launchBlob() {
  const htmlContent = `
    <html>
      <head>
        <title>Galaxy</title>
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
  if (newWindow) {
    newWindow.onload = () => {
      newWindow.document.title = "Galaxy";
    };
  }
}

function aboutBlank() {
  var y = window.open("about:blank#", "_blank");
  y.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
            <title>Classroom</title>
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

function auto() {
  if (localStorage.getItem("autoBlob") === "true") {
    launchBlob();
  }

  if (localStorage.getItem("autoAbout") === "true") {
    aboutBlank();
    location.replace(
      "https://lightingshovestature.com/pwy8jeq59?key=00e97abb2b6ada2db15543761f62ca2d"
    );
  }
}
auto();
