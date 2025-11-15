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

function openWindow(windowSrc) {
  let windowEl = document.createElement("div");
  let iframe = document.createElement("iframe");

  windowEl.className = "window";
  windowEl.style.position = "absolute";
  windowEl.style.left = "100px";
  windowEl.style.top = "100px";

  windowEl.innerHTML = `
    <div class="windowControls ">
      <div class="closeIcon windowcontrolicon windowcontroliconred">
        <img src="assets/img/icons/close.png" class="windowIcons" />
      </div>
      <div class="square windowcontrolicon" onclick="changeIcon()">
        <img src="assets/img/icons/stop.png" class="windowIcons" id="square" />
        <img src="assets/img/icons/layers.png" class="windowIcons" id="squares" />
      </div>
      <div class="minimize windowcontrolicon">
        <img src="assets/img/icons/minimize-sign.png" class="windowIcons" />
      </div>
    </div>
  `;

  iframe.className = "windowFrame";
  iframe.src = windowSrc;
  windowEl.appendChild(iframe);
  document.body.appendChild(windowEl);

  const controls = windowEl.querySelector(".windowControls");
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  controls.addEventListener("mousedown", (e) => {
    isDragging = true;
    offset.x = e.clientX - windowEl.offsetLeft;
    offset.y = e.clientY - windowEl.offsetTop;
    iframe.style.pointerEvents = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    windowEl.style.left = e.clientX - offset.x + "px";
    windowEl.style.top = e.clientY - offset.y + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    iframe.style.pointerEvents = "auto";
  });
}
openWindow("p.html");
