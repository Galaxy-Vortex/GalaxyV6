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

function openWindow(
  windowSrc,
  windowLeft,
  windowRight,
  windowHeight,
  windowWidth
) {
  const snapLeft = document.getElementById("snap-left");
  const snapRight = document.getElementById("snap-right");
  let snapTarget = null;
  const windowEl = document.createElement("div");
  const iframe = document.createElement("iframe");
  let windowValue = "1";

  windowEl.className = "window";
  windowEl.style.position = "absolute";
  windowEl.style.left = windowLeft || "19%";
  windowEl.style.top = windowRight || "19%";
  windowEl.style.height = windowHeight || "45%";
  windowEl.style.width = windowWidth || "45%";
  windowEl.style.zIndex = ++zindex;
  windowEl.style.transition = "opacity 0.3s ease";
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
    
    <div class="window-overlay"></div> 

    <div class="resize-handle resize-top-left"></div>
    <div class="resize-handle resize-top-right"></div>
    <div class="resize-handle resize-bottom-left"></div>
    <div class="resize-handle resize-bottom-right"></div>

    <div class="resize-handle resize-top"></div>
    <div class="resize-handle resize-right"></div>
    <div class="resize-handle resize-bottom"></div>
    <div class="resize-handle resize-left"></div>
  `;

  const squareBtn = windowEl.querySelector(".square");
  const closeBtn = windowEl.querySelector(".closeIcon");
  const minimizeBtn = windowEl.querySelector(".minimize");

  const overlay = windowEl.querySelector(".window-overlay");

  function focusCurrentWindow() {
    windowEl.style.zIndex = ++zindex;

    const allWindows = document.querySelectorAll(".window");

    allWindows.forEach((win) => {
      const winOverlay = win.querySelector(".window-overlay");
      if (winOverlay) {
        if (win === windowEl) {
          winOverlay.style.display = "none";
        } else {
          winOverlay.style.display = "block";
        }
      }
    });
  }

  overlay.addEventListener("mousedown", (e) => {
    focusCurrentWindow();
  });

  focusCurrentWindow();

  squareBtn.addEventListener("click", changeIcon);
  closeBtn.addEventListener("click", closeWindow);
  minimizeBtn.addEventListener("click", minimizeWindow);

  iframe.className = "windowFrame";
  iframe.src = windowSrc;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  windowEl.appendChild(iframe);
  document.body.appendChild(windowEl);

  windowEl.style.transform = "scale(0.8)";
  windowEl.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  requestAnimationFrame(() => {
    windowEl.style.transform = "scale(1)";
    windowEl.style.opacity = "1";
  });

  const controls = windowEl.querySelector(".windowMove");
  const handles = windowEl.querySelectorAll(".resize-handle");

  controls.addEventListener("dblclick", () => {
    changeIcon();
  });

  let isDragging = false;
  let isResizing = false;
  let currentHandle = null;

  let startX, startY, startW, startH, startL, startT;

  let offset = { x: 0, y: 0 };
  const allIframes = document.querySelectorAll(".windowFrame");

  const navBar = document.querySelector(".nav");
  const navBarHeight = navBar ? navBar.offsetHeight : 0;

  controls.addEventListener("mousedown", (e) => {
    focusCurrentWindow();

    windowEl.style.transition = "0s";
    if (windowEl.classList.contains("snapped")) {
      console.log("restoring");
      windowEl.classList.remove("snapped");
      windowEl.style.width = "45%";
      windowEl.style.height = "45%";
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      windowEl.style.transition = "0s";
      windowEl.style.top = "0px";
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    } else if (windowEl.style.width == "99.999%") {
      windowValue = 0;
      changeIcon();
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      windowEl.style.transition = "0s";
      windowEl.style.top = "0px";
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    } else if (windowValue === "1") {
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    } else if (windowValue === "0") {
      changeIcon();
      console.log("ChangeICON");
      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      windowEl.style.transition = "0s";
      windowEl.style.top = "0px";
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
    }
  });

  handles.forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      focusCurrentWindow();
      isResizing = true;
      currentHandle = handle;

      startX = e.clientX;
      startY = e.clientY;

      const rect = windowEl.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;
      startL = windowEl.offsetLeft;
      startT = windowEl.offsetTop;

      allIframes.forEach((f) => (f.style.pointerEvents = "none"));
      windowEl.style.transition = "0s";
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - navBarHeight - windowEl.offsetHeight;

      windowEl.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
      windowEl.style.top = Math.max(25, Math.min(newY, maxY)) + "px";

      const snapMargin = 100;
      snapTarget = null;

      if (e.clientX < snapMargin) {
        snapLeft.classList.add("snap-active");
        snapRight.classList.remove("snap-active");
        snapTarget = "left";
      } else if (e.clientX > window.innerWidth - snapMargin) {
        snapRight.classList.add("snap-active");
        snapLeft.classList.remove("snap-active");
        snapTarget = "right";
      } else {
        snapLeft.classList.remove("snap-active");
        snapRight.classList.remove("snap-active");
      }
    }

    if (isResizing) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const minW = 200;
      const minH = 150;

      if (
        currentHandle.classList.contains("resize-right") ||
        currentHandle.classList.contains("resize-top-right") ||
        currentHandle.classList.contains("resize-bottom-right")
      ) {
        let newW = startW + dx;
        const maxW = window.innerWidth - startL;
        newW = Math.max(minW, Math.min(newW, maxW));
        windowEl.style.width = newW + "px";
      }
      if (
        currentHandle.classList.contains("resize-bottom") ||
        currentHandle.classList.contains("resize-bottom-left") ||
        currentHandle.classList.contains("resize-bottom-right")
      ) {
        let newH = startH + dy;

        const maxBottom = window.innerHeight - navBarHeight - startT;

        newH = Math.max(minH, Math.min(newH, maxBottom));

        windowEl.style.height = newH + "px";
      }

      if (
        currentHandle.classList.contains("resize-left") ||
        currentHandle.classList.contains("resize-top-left") ||
        currentHandle.classList.contains("resize-bottom-left")
      ) {
        let newL = startL + dx;
        let newW = startW - dx;

        if (newL < 0) {
          newL = 0;
          newW = startL + startW;
        }

        if (newW < minW) {
          newW = minW;
          newL = startL + startW - minW;
        }

        windowEl.style.left = newL + "px";
        windowEl.style.width = newW + "px";
      }

      if (
        currentHandle.classList.contains("resize-top") ||
        currentHandle.classList.contains("resize-top-left") ||
        currentHandle.classList.contains("resize-top-right")
      ) {
        let newT = startT + dy;
        let newH = startH - dy;

        if (newT < 25) {
          newT = 25;
          newH = startH + startT;
        }

        if (newH < minH) {
          newH = minH;
          newT = startT + startH - minH;
        }

        windowEl.style.top = newT + "px";
        windowEl.style.height = newH + "px";
      }
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
    if (snapTarget === "left") {
      windowEl.classList.add("snapped");
      snapLeft.classList.remove("snap-active");
      windowEl.style.transition = "all 0.25s ease";
      windowEl.style.left = "0px";
      windowEl.style.top = "0px";
      windowEl.style.width = "50vw";
      windowEl.style.height = "calc(100% - 52px)";
    } else if (snapTarget === "right") {
      windowEl.classList.add("snapped");
      snapRight.classList.remove("snap-active");
      windowEl.style.transition = "all 0.25s ease";
      windowEl.style.left = "50vw";
      windowEl.style.top = "23px";
      windowEl.style.width = "50vw";
      windowEl.style.height = "calc(100% - 52px)";
    }
    snapTarget = null;
    snapLeft.classList.remove("snap-active");
    snapRight.classList.remove("snap-active");

    allIframes.forEach((f) => (f.style.pointerEvents = "auto"));
  });

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
      windowEl.style.height = "calc(100% - 51px)";
    } else {
      squares.style.display = "none";
      square.style.display = "flex";
      windowValue = "1";

      windowEl.style.left = "500px";
      windowEl.style.top = "200px";
      windowEl.style.width = "45%";
      windowEl.style.height = "45%";
    }
  }

  function closeWindow() {
    windowEl.style.animation = "closeWindow 0.2s ease forwards";
    windowEl.addEventListener("animationend", () => {
      windowEl.remove();
    });
  }

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

      focusCurrentWindow();

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
const dock = document.querySelector(".nav");
const icons = [...document.querySelectorAll(".icons")];

let mouseX = null;

icons.forEach((icon) => {
  icon._scale = 1;
  icon._targetScale = 1;
});

dock.addEventListener("mousemove", (e) => {
  const rect = dock.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

dock.addEventListener("mouseleave", () => {
  mouseX = null;
});

function softFalloff(t) {
  return t * t * (3 - 2 * t);
}

function imacEffect() {
  requestAnimationFrame(imacEffect);

  const dockRect = dock.getBoundingClientRect();

  icons.forEach((icon) => {
    const iconRect = icon.getBoundingClientRect();
    const iconCenter = iconRect.left - dockRect.left + iconRect.width / 2;

    let distance = mouseX === null ? 9999 : Math.abs(mouseX - iconCenter);

    const minScale = 1;
    const maxScale = 1.8;
    const range = 90;

    let influence = Math.max(0, 1 - distance / range);

    influence = softFalloff(influence);

    icon._targetScale = minScale + (maxScale - minScale) * influence;

    const stiffness = 0.15;
    const damping = 0.12;

    const delta = icon._targetScale - icon._scale;
    icon._scale += delta * stiffness;
    icon._scale -= icon._scale * damping * 0.001;

    icon.style.transform = `scale(${icon._scale})`;
  });
}

imacEffect();
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("timeDisplay").textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();
