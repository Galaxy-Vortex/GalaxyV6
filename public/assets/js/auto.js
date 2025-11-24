// Helper: update favicon
function updateFavicon(href) {
  if (!href) return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

// Helper: toggle glassmorphism background
function toggleGlass(enabled) {
  if (enabled) {
    document.documentElement.style.setProperty("--glassmorphismBG", "rgba(0,0,0,1)");
  } else {
    document.documentElement.style.removeProperty("--glassmorphismBG");
  }
}

// Apply stored values once on load
function applyStoredValues() {
  const savedTitle = localStorage.getItem("pageTitle");
  if (savedTitle) document.title = savedTitle;

  updateFavicon(localStorage.getItem("pageFavicon"));

  const backgroundURL = localStorage.getItem("backgroundURL");
  if (backgroundURL) {
    document.documentElement.style.setProperty("--backgroundURL", `url(${backgroundURL})`);
  }

  toggleGlass(localStorage.getItem("glassToggleStore") === "true");
}

// Listen for changes across tabs/windows
window.addEventListener("storage", (event) => {
  switch (event.key) {
    case "pageTitle":
      if (event.newValue) document.title = event.newValue;
      break;
    case "pageFavicon":
      updateFavicon(event.newValue);
      break;
    case "backgroundURL":
      document.documentElement.style.setProperty("--backgroundURL", `url(${event.newValue})`);
      break;
    case "glassToggleStore":
      toggleGlass(event.newValue === "true");
      break;
  }
});

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", applyStoredValues);