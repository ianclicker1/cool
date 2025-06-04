let clicks = 0;

// Load data from vault on load
window.addEventListener("message", (event) => {
  if (event.origin !== "https://sharedvault.github.io") return;
  if (event.data.type === "load-response") {
    const data = event.data.payload;
    clicks = data.clicks || 0;
    updateUI();
  }
});

// Request saved data
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("vault").contentWindow.postMessage(
    { type: "load" },
    "https://sharedvault.github.io"
  );
});

function updateUI() {
  document.getElementById("clicks").textContent = clicks.toLocaleString();
}

function addClick() {
  clicks++;
  updateUI();
  saveToVault();
}

function saveToVault() {
  const gameData = {
    clicks,
    world: 1,
    upgrades: {},
    rebirths: 0
  };

  document.getElementById("vault").contentWindow.postMessage(
    { type: "save", payload: gameData },
    "https://sharedvault.github.io"
  );
}
