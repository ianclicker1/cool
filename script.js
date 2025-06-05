let clicks = 0;
let rebirths = 0;
let multiplier = 1;
let upgradeLevels = [0, 0, 0]; // For 3 upgrades
let world = 1;

const clickDisplay = document.getElementById("clicks-display");
const rebirthBtn = document.getElementById("rebirth-button");
const multiplierBtn = document.getElementById("multiplier");
const menuBtn = document.getElementById("menu-button");
const worldsPopup = document.getElementById("world-select");

const upgradeIcons = [
  "iancursor.png",
  "ianminer.png",
  "ianrobot.png"
];

// --- CLICK EVENT ---
document.getElementById("ian").onclick = () => {
  clicks += getClickAmount();
  updateUI();
};

// --- MULTIPLIER SWITCH ---
const multipliers = [1, 5, 10, 20];
let currentMultiIndex = 0;
multiplierBtn.onclick = () => {
  currentMultiIndex = (currentMultiIndex + 1) % multipliers.length;
  multiplierBtn.textContent = multipliers[currentMultiIndex] + "x";
};

// --- MENU BUTTON ---
menuBtn.onclick = () => {
  worldsPopup.classList.remove("hidden");
};

document.getElementById("close-worlds").onclick = () => {
  worldsPopup.classList.add("hidden");
};

// --- CLICK AMOUNT ---
function getClickAmount() {
  return 1 + rebirths * 0.5;
}

// --- UPDATE UI ---
function updateUI() {
  clickDisplay.textContent = Math.floor(clicks).toLocaleString();
  rebirthBtn.disabled = clicks < 100000;
  rebirthBtn.classList.toggle("available", clicks >= 100000);
}

// --- FORMAT NUMBERS ---
function format(n) {
  if (n < 1000) return n;
  if (n < 1_000_000) return (n / 1000).toFixed(1) + "K";
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1) + "M";
  return (n / 1_000_000_000).toFixed(1) + "B";
}

// --- SAVE & LOAD ---
function saveGame() {
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("rebirths", rebirths);
  localStorage.setItem("world", world);
}

function loadGame() {
  clicks = parseFloat(localStorage.getItem("clicks") || "0");
  rebirths = parseInt(localStorage.getItem("rebirths") || "0");
  world = parseInt(localStorage.getItem("world") || "1");
  updateUI();
}

// --- INIT ---
loadGame();
updateUI();
setInterval(saveGame, 5000);
