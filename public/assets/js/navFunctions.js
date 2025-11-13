const back = document.getElementById("goBack");
const forward = document.getElementById("goForward");
const reload = document.getElementById("reload");
const moreBtn = document.getElementById("more");
const overlay = document.getElementById("overlay");
const moreMenu = document.getElementById("moreMenu"); // <-- missing before
const changeProxy = document.getElementById("changeProxy");
const proxyMenu = document.getElementById("proxyMenu");
const setUV = document.getElementById("setUV");
const setSJ = document.getElementById("setSJ");
const setAuto = document.getElementById("setAuto");
const shortcut = document.getElementById("AddShortcut");
const iframe = document.getElementById(
  "frame" + activeTabId.replace("tab", "")
);

reload.addEventListener("click", () => {
  iframe.contentWindow.location.reload();
  input.value = getOriginalUrl(iframe.src);
});

forward.addEventListener("click", () => {
  iframe.contentWindow.history.forward();
});

back.addEventListener("click", () => {
  iframe.contentWindow.history.back();
});
moreBtn.addEventListener("click", (e) => {
  moreMenu.classList.toggle("show");
  overlay.classList.toggle("show");
  e.stopPropagation();
});

changeProxy.addEventListener("click", (e) => {
  proxyMenu.classList.toggle("show");
  e.stopPropagation();
});

setUV.addEventListener("click", () => {
  console.log("UV selected");
  localStorage.setItem("proxyType", "UV");
  proxyMenu.classList.remove("show");
  moreMenu.classList.remove("show");
  overlay.classList.remove("show");
});

setSJ.addEventListener("click", () => {
  console.log("SJ selected");
  localStorage.setItem("proxyType", "SJ");
  proxyMenu.classList.remove("show");
  moreMenu.classList.remove("show");
  overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
  overlay.classList.toggle("hide");
  moreMenu.classList.toggle("hide");
  proxyMenu.classList.remove("show");
});
let shortcutNumber = localStorage.getItem("shortcutNumber") || 0;

function AddShortcut() {
  shortcutNumber++;
  let shortcuturl = prompt("Enter Shortcut URL", "https://example.com");
  if (!shortcuturl) return;

  localStorage.setItem("shortcutURL" + shortcutNumber, shortcuturl);

  let shortcutname = prompt("Enter Shortcut Name", "Example");
  if (!shortcutname) shortcutname = shortcuturl;

  localStorage.setItem("shortcutname" + shortcutNumber, shortcutname);
  localStorage.setItem("shortcutNumber", shortcutNumber);

  const bookmarks = document.getElementById("bookmarks");

  const bookmark = document.createElement("div");
  bookmark.className = "bookmarklets";
  bookmark.id = "bookmarklets" + shortcutNumber;
  bookmark.textContent = shortcutname;

  bookmark.onclick = () => {
    input.value = shortcuturl;
    input.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", keyCode: 13, bubbles: true })
    );
  };

  bookmark.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const confirmDelete = confirm(`Remove bookmark "${shortcutname}"?`);
    if (confirmDelete) {
      localStorage.removeItem("shortcutURL" + shortcutNumber);
      localStorage.removeItem("shortcutname" + shortcutNumber);
      bookmark.remove();
    }
  });

  bookmarks.appendChild(bookmark);
}

window.onload = () => {
  const bookmarks = document.getElementById("bookmarks");
  const count = localStorage.getItem("shortcutNumber") || 0;

  for (let i = 1; i <= count; i++) {
    const url = localStorage.getItem("shortcutURL" + i);
    const name = localStorage.getItem("shortcutname" + i);
    if (!url || !name) continue;

    const bookmark = document.createElement("div");
    bookmark.className = "bookmarklets";
    bookmark.id = "bookmarklets" + i;
    bookmark.textContent = name;
    bookmark.onclick = () => {
      input.value = url;
      input.dispatchEvent(
        new KeyboardEvent("keyup", { key: "Enter", keyCode: 13, bubbles: true })
      );
    };
    bookmark.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const confirmDelete = confirm(`Remove bookmark "${name}"?`);
      if (confirmDelete) {
        localStorage.removeItem("shortcutURL" + i);
        localStorage.removeItem("shortcutname" + i);
        bookmark.remove();
      }
    });

    bookmarks.appendChild(bookmark);
  }
};
