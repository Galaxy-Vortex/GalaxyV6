import { openApp, loadingShow, loadingHide } from "/assets/js/openapps.js";
import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";

const PINNED_GAMES_KEY = "pinnedGameNames";

function getPinnedGames() {
  const pinnedNames = localStorage.getItem(PINNED_GAMES_KEY);
  return pinnedNames ? JSON.parse(pinnedNames) : [];
}

function savePinnedGames(names) {
  localStorage.setItem(PINNED_GAMES_KEY, JSON.stringify(names));
}

function togglePinGame(name) {
  let pinned = getPinnedGames();

  if (pinned.includes(name)) {
    pinned = pinned.filter((n) => n !== name);
  } else {
    pinned.unshift(name);
  }
  savePinnedGames(pinned);
  renderGames(window.allGames);
}
window.allGames = [];
const appsContainer = document.querySelector(".games");
const pinnedContainer = document.querySelector(".pinned-games");

fetch("/assets/json/g.json")
  .then((response) => response.json())
  .then((games) => {
    window.allGames = games;
    renderGames(games);
  });

function renderGames(games) {
  pinnedContainer.innerHTML = "";
  appsContainer.innerHTML = "";

  const pinnedNames = getPinnedGames();
  const unpinnedGames = [];
  const pinnedElements = [];

  appsContainer.innerHTML = `
      <div class="randomcard gameStagger" id="randomGameButton">
        <div class="randombg"></div>
        <div class="randomblob"></div>
        <p>Surprise me!</p>
      </div>
    `;

  games.forEach((game) => {
    const gameName = game.name;
    const isPinned = pinnedNames.includes(gameName);

    const gameElement = document.createElement("div");
    gameElement.className = `game ${isPinned ? "pinned" : ""}`;
    gameElement.dataset.name = gameName;

    const pinIcon = isPinned
      ? "/assets/img/icons/close.png"
      : "/assets/img/icons/pin.png";
    const pinTitle = isPinned ? "Unpin" : "Pin";
    gameElement.innerHTML = `
        <div class="innergame gameStagger">
        <div class="gamecontainer">
            <img src="/assets/img/gimg/${game.image}" alt="${game.name}" class="cards" loading="lazy">
            <h3 class="cardname">${game.name}</h3>
            <h2 class="cardgenre">${game.genre}</h2>
            <img class="pin-btn" title="${pinTitle}" data-name="${gameName}" src="${pinIcon}">
        </div>
        </div>
        `;
    gameElement
      .querySelector(".innergame")
      .addEventListener("click", async (e) => {
        if (e.target.closest(".pin-btn")) {
          return;
        }

        let xt;
        if (game.url) {
          xt = game.type || "SJ";
          var ute = game.url;
          openApp(ute, xt);
          frame.style.zIndex = "1";
          document.documentElement.style.overflow = "hidden";
          const goBackBtn = document.getElementById("goBackBtn");
          const iframe = document.getElementById("frame");
          goBackBtn.style.top = "20px";
          goBackBtn.addEventListener("click", () => {
            iframe.style.zIndex = "-1";
            iframe.src = "";
            document.documentElement.style.overflow = "";
            goBackBtn.style.top = "-80px";
          });
        } else if (game.file) {
          var fil = game.file;
          frame.style.zIndex = "1";
          frame.src = fil;
          document.documentElement.style.overflow = "hidden";
          const goBackBtn = document.getElementById("goBackBtn");
          const iframe = document.getElementById("frame");
          goBackBtn.style.top = "20px";
          goBackBtn.addEventListener("click", () => {
            iframe.style.zIndex = "-1";
            iframe.src = "";
            document.documentElement.style.overflow = "";
            goBackBtn.style.top = "-80px";
          });
        }
      });

    gameElement.querySelector(".pin-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      togglePinGame(gameName);
    });

    if (isPinned) {
      pinnedElements.push(gameElement);
    } else {
      unpinnedGames.push(gameElement);
    }
  });
  pinnedNames.forEach((name) => {
    const element = pinnedElements.find((el) => el.dataset.name === name);
    if (element) {
      pinnedContainer.appendChild(element);
    }
  });
  unpinnedGames.forEach((gameElement) => {
    appsContainer.appendChild(gameElement);
  });

  document.getElementById("randomGameButton").addEventListener("click", () => {
    const games = document.querySelectorAll(".game");
    const availableGames = Array.from(games).filter(
      (g) => g.style.display !== "none"
    );
    if (availableGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableGames.length);
      availableGames[randomIndex].querySelector(".innergame").click();
    }
  });

  const searchEvent = new Event("input");
  document.getElementById("gamesearch").dispatchEvent(searchEvent);

  document.querySelectorAll(".genre-filter").forEach((checkbox) => {
    const changeEvent = new Event("change");
    checkbox.dispatchEvent(changeEvent);
  });
}

document.getElementById("gamesearch").addEventListener("input", function () {
  const searchitem = this.value.toLowerCase();
  const games = document.querySelectorAll(".game");
  games.forEach((game) => {
    const gameName = game.querySelector("h3").textContent.toLowerCase();
    const gameTag = game.querySelector("h2").textContent.toLowerCase();
    if (gameName.includes(searchitem) || gameTag.includes(searchitem)) {
      game.style.display = "flex";
      game.style.opacity = "1";
    } else {
      game.style.display = "none";
    }
  });
});

document.querySelectorAll(".genre-filter").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedGenres = Array.from(
      document.querySelectorAll(".genre-filter:checked")
    ).map((checkbox) => checkbox.value.toLowerCase());

    const games = document.querySelectorAll(".game");

    games.forEach((game) => {
      const gameGenreText = game
        .querySelector(".cardgenre")
        .textContent.toLowerCase();

      const matches =
        selectedGenres.length === 0 ||
        selectedGenres.some((filter) => gameGenreText.includes(filter));

      if (matches) {
        game.style.display = "flex";
        game.style.opacity = "1";
      } else {
        game.style.display = "none";
      }
    });
  });
});
