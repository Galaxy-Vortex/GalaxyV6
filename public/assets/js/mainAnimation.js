if (localStorage.getItem("onboarding") == null) {
  location.href = "onboarding/";
} else {
}
let UserName = localStorage.getItem("name");
let backgroundURL = localStorage.getItem("backgroundURL");
if (backgroundURL == null) {
  localStorage.setItem("backgroundURL", "assets/img/bg3.png");
} else {
}
backgroundURL = localStorage.getItem("backgroundURL");

document.documentElement.style.setProperty(
  "--backgroundURL",
  `url(${backgroundURL})`
);

gsap.fromTo(
  ".navStagger",
  {
    y: 30,
    opacity: 0,
  },
  {
    duration: 0.4,
    y: 0,
    opacity: 1,
    stagger: 0.1,
  }
);
let zindex = "0";

function openWindow(windowSrc) {
  const windowEl = document.createElement("div");
  const iframe = document.createElement("iframe");
  let windowValue = "1";

  windowEl.className = "window";
  windowEl.style.position = "absolute";
  windowEl.style.left = "500px";
  windowEl.style.top = "100px";
  windowEl.style.boxSizing = "border-box";
  windowEl.style.zIndex = zindex++;

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
    <div class="resize-handle" 
    </div>
  `;
  const squareBtn = windowEl.querySelector(".square");
  squareBtn.addEventListener("click", changeIcon);
  const closeBtn = windowEl.querySelector(".closeIcon");
  closeBtn.addEventListener("click", closeWindow);
  const minimizeBtn = windowEl.querySelector(".minimize");
  minimizeBtn.addEventListener("click", minimizeWindow);

  iframe.className = "windowFrame";
  iframe.src = windowSrc;
  iframe.style.width = "100%";
  iframe.style.border = "none";
  windowEl.appendChild(iframe);
  document.body.appendChild(windowEl);

  const controls = windowEl.querySelector(".windowMove");
  const resizeHandle = windowEl.querySelector(".resize-handle");

  let isDragging = false;
  let isResizing = false;
  let offset = { x: 0, y: 0 };
  let frame = document.querySelectorAll(".windowFrame");
  controls.addEventListener("mousedown", (e) => {
    windowEl.style.transition = "0s";
    windowEl.style.zIndex = zindex++;
    if (windowValue === "1") {
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
      frame.forEach((f) => (f.style.pointerEvents = "none"));
    } else {
      changeIcon();
      windowEl.style.transition = "0s";
      windowEl.style.top = "0px";
      isDragging = true;
      offset.x = e.clientX - windowEl.offsetLeft;
      offset.y = e.clientY - windowEl.offsetTop;
      frame.forEach((f) => (f.style.pointerEvents = "none"));
    }
  });

  // --- resizing stuff
  resizeHandle.addEventListener("mousedown", (e) => {
    windowEl.style.transition = "0s";
    windowEl.style.zIndex = zindex++;
    isResizing = true;
    offset.x = e.clientX;
    offset.y = e.clientY;
    iframe.style.pointerEvents = "none";
    e.stopPropagation();
  });
  document.addEventListener("mousemove", (e) => {
    iframe.style.pointerEvents = "none";

    windowEl.style.transition = "0s";
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      const winW = windowEl.offsetWidth;
      const winH = windowEl.offsetHeight;
      const maxX = window.innerWidth - winW;
      const maxY = window.innerHeight - winH;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      windowEl.style.left = newX + "px";
      windowEl.style.top = newY + "px";
    }

    if (isResizing) {
      const newWidth = Math.max(200, e.clientX - windowEl.offsetLeft);
      const newHeight = Math.max(150, e.clientY - windowEl.offsetTop);
      windowEl.style.width = newWidth + "px";
      windowEl.style.height = newHeight + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
    iframe.style.pointerEvents = "auto";
  });
  let square = windowEl.querySelector("#square");
  let squares = windowEl.querySelector("#squares");
  function changeIcon() {
    if (windowValue === "1") {
      windowEl.style.transition =
        "width 0.3s ease, height 0.3s ease, left 0.3s ease, top 0.3s ease";
      square.style.display = "none";
      squares.style.display = "flex";
      windowValue = "0";
      console.log(windowValue);
      windowEl.style.left = "0px";
      windowEl.style.top = "0px";
      windowEl.style.width = window.innerWidth + "px";
      windowEl.style.height = window.innerHeight + "px";
    } else {
      windowEl.style.transition =
        "width 0.3s ease, height 0.3s ease, left 0.3s ease, top 0.3s ease";
      squares.style.display = "none";
      square.style.display = "flex";
      windowValue = "1";
      console.log(windowValue);
      windowEl.style.left = "500px";
      windowEl.style.top = "200px";
      windowEl.style.width = "900px";
      windowEl.style.height = "500px";
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

    // Create minimized icon
    const icon = document.createElement("div");
    icon.className = "minimizedWindowIcon";
    minimizedContainer.appendChild(icon);

    // Animate window shrink
    const rect = icon.getBoundingClientRect();
    windowEl.style.transition = "all 0.3s ease";
    windowEl.style.width = rect.width + "px";
    windowEl.style.height = rect.height + "px";
    windowEl.style.left = rect.left + "px";
    windowEl.style.top = rect.top + "px";
    windowEl.style.opacity = "0";

    setTimeout(() => {
      windowEl.style.display = "none";
    }, 300);

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
      windowEl.style.left = "500px";
      windowEl.style.top = "200px";
      windowEl.style.opacity = "1";

      icon.remove();
      preview.remove();
    });
  }
}
