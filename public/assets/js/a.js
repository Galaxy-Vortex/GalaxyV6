import { openApp, loadingShow, loadingHide } from "/assets/js/openapps.js";
import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";

fetch("/assets/json/a.json")
  .then((response) => response.json())
  .then((games) => {
    const appsContainer = document.querySelector(".games");

    games.forEach((game, index) => {
      const gameElement = document.createElement("div");
      gameElement.className = "game";
      gameElement.dataset.index = index;

      gameElement.innerHTML = `
      <div class="innergame">
      <div class="gamecontainer">
        <img src="/assets/img/aimg/${game.image}" alt="${game.name}" class="cards" loading="lazy">
        <h3 class="cardname">${game.name}</h3>
        <h2 class="cardgenre">${game.genre}</h2>
      </div>
      </div>
      `;

      gameElement.addEventListener("click", async () => {
        if (game.url) {
          var ute = game.url;
          let xt;
          if(game.type) {
            xt = game.type
          } else {
            xt="SJ"
          }
          openApp(ute, xt);
          frame.style.zIndex = "1";
            frame.style.opacity = "1";

          document.documentElement.style.overflow = "hidden";
          const goBackBtn = document.getElementById("goBackBtn");
          const iframe = document.getElementById("frame");
          goBackBtn.style.top = "20px";

          goBackBtn.addEventListener("click", () => {
            iframe.style.zIndex = "-1";
            iframe.src = "";
            document.documentElement.style.overflow = "";
            goBackBtn.style.top = "-80px";
            frame.style.opacity = "0";
          });
        } else if (game.file) {
          var fil = game.file;
          localStorage.setItem("gameload", fil);
          window.location.href = "load.html";
        }
      });

      appsContainer.appendChild(gameElement);
    });
  });

document.getElementById("gamesearch").addEventListener("input", function () {
  const searchitem = this.value.toLowerCase();
  const games = document.querySelectorAll(".game");
  games.forEach((game) => {
    const gameName = game.querySelector("h3").textContent.toLowerCase();
    const gameTag = game.querySelector("h2").textContent.toLowerCase();
    if (gameName.includes(searchitem) || gameTag.includes(searchitem)) {
      game.style.display = "flex";
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
      const gameGenre = game
        .querySelector(".cardgenre")
        .textContent.toLowerCase();
      if (selectedGenres.length === 0 || selectedGenres.includes(gameGenre)) {
        game.style.display = "flex";
      } else {
        game.style.display = "none";
      }
    });
  });
});

document.getElementById("randomGameButton").addEventListener("click", () => {
  const games = document.querySelectorAll(".game");
  if (games.length > 0) {
    const randomIndex = Math.floor(Math.random() * games.length);
    games[randomIndex].click(); // Trigger a click event on the chosen game
  }
});
