let clicks = 0;
let world = 1;

window.addEventListener("message", (event) => {
  if (event.origin !== "https://sharedvault.github.io") return;
  if (event.data.type === "load-response") {
    const data = event.data.payload;
    clicks = data.clicks || 0;
    world = data.world || 1;
    updateUI();
    updateTheme();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("vault").contentWindow.postMessage(
    { type: "load" },
    "https://sharedvault.github.io"
  );
});

function updateUI() {
  document.getElementById("clicks").textContent = clicks.toLocaleString();
  document.getElementById("world").textContent = world;
  updateTheme();
}

function updateTheme() {
  document.body.classList.remove("world1", "world2");
  document.body.classList.add("world" + world);
}

function addClick() {
  clicks++;
  updateUI();
  saveToVault();
}

function switchWorld() {
  world = world === 1 ? 2 : 1;
  updateUI();
  saveToVault();
}

function saveToVault() {
  const gameData = {
    clicks,
    world,
    upgrades: {},
    rebirths: 0
  };

  document.getElementById("vault").contentWindow.postMessage(
    { type: "save", payload: gameData },
    "https://sharedvault.github.io"
  );
}
