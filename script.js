let clicks = 0;
let multiplier = 1;
let currentWorld = 1;
let upgrades = {
  1: [0, 0, 0], // World 1: Cursor, Miner, Robot
  2: [0, 0, 0]  // World 2: Alien, Spaceship, UFO
};
let upgradeBasePrices = [
  [15, 100, 500],  // World 1
  [1000, 2500, 10000]  // World 2
];
let upgradeImages = [
  ["iancursor.png", "ianminer.png", "ianrobot.png"],
  ["ianalien.png", "ianspaceship.png", "ianufo.png"]
];

function formatClicks(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
  return Math.floor(val);
}

function updateClickDisplay() {
  document.getElementById("click-count").innerText = formatClicks(clicks) + " Clicks";
}

function handleClick() {
  let earned = 1;
  earned += upgrades[currentWorld][0] * 0.5;
  earned += upgrades[currentWorld][1] * 2;
  earned += upgrades[currentWorld][2] * 10;
  clicks += earned;
  updateClickDisplay();
}
function getUpgradeCost(world, index) {
  const base = upgradeBasePrices[world - 1][index];
  const level = upgrades[world][index];
  return Math.floor(base * Math.pow(1.5, level));
}

function buyUpgrade(index) {
  const cost = getUpgradeCost(currentWorld, index);
  if (clicks >= cost && upgrades[currentWorld][index] < 50) {
    clicks -= cost;
    upgrades[currentWorld][index]++;
    updateUpgradeIcons(index);
    updateUI();
    saveGame();
  }
}

function updateUpgradeIcons(index) {
  const bar = document.querySelector(`#upgrade-bar-${index}`);
  bar.innerHTML = '';
  for (let i = 0; i < upgrades[currentWorld][index]; i++) {
    const icon = document.createElement('img');
    icon.src = upgradeImages[currentWorld - 1][index];
    icon.className = 'upgrade-icon';
    bar.appendChild(icon);
  }
}

function switchWorld() {
  if (currentWorld === 1 && clicks < 10000000) {
    showPopup("You need 10M clicks to unlock Mars.");
    return;
  }
  currentWorld = currentWorld === 1 ? 2 : 1;
  updateUI();
  saveGame();
}

function rebirth() {
  if (clicks < 100000) return;
  clicks = 0;
  upgrades[currentWorld] = [0, 0, 0];
  updateAllUpgradeIcons();
  updateUI();
  saveGame();
}

function updateAllUpgradeIcons() {
  for (let i = 0; i < 3; i++) updateUpgradeIcons(i);
}

function showPopup(text) {
  const popup = document.getElementById("popup");
  popup.innerText = text;
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 3000);
}
function saveGame() {
  const data = {
    clicks,
    upgrades,
    currentWorld,
    lastSaved: Date.now()
  };
  localStorage.setItem("ianClickerSave", JSON.stringify(data));
}

function loadGame() {
  const saved = localStorage.getItem("ianClickerSave");
  if (saved) {
    const data = JSON.parse(saved);
    clicks = data.clicks || 0;
    upgrades = data.upgrades || { 1: [0, 0, 0], 2: [0, 0, 0] };
    currentWorld = data.currentWorld || 1;

    // Offline progress
    const timeAway = (Date.now() - (data.lastSaved || Date.now())) / 1000;
    const cps = getTotalCPS();
    const earned = cps * timeAway;
    clicks += earned;
    if (earned > 0) showPopup(`You earned ${formatNumber(earned)} clicks while offline!`);
  }
  updateUI();
}

function getTotalCPS() {
  const [a, b, c] = upgrades[currentWorld];
  return (
    a * (1 + a * 0.5) +
    b * (5 + b * 0.5) +
    c * (10 + c * 0.5)
  );
}

function updateUI() {
  // Click display
  document.getElementById("clickCount").innerText = formatNumber(clicks);

  // Update upgrade buttons
  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`upgrade${i}`);
    const cost = getUpgradeCost(currentWorld, i);
    btn.className = clicks >= cost ? "upgrade available" : "upgrade locked";
    btn.querySelector(".price").innerText = `${formatNumber(cost)} Clicks`;
    updateUpgradeIcons(i);
  }

  // Rebirth button
  const rebirthBtn = document.getElementById("rebirth");
  rebirthBtn.className = clicks >= 100000 ? "rebirth available" : "rebirth locked";

  // Backgrounds
  const body = document.body;
  if (currentWorld === 1) {
    body.style.background = "linear-gradient(to bottom, #003300, #00cc66)";
  } else {
    body.style.background = "linear-gradient(to bottom, #660000, #ff6666)";
  }

  // Rebirth count
  document.getElementById("rebirthCount").innerText = formatNumber(rebirths[currentWorld]);

  // Update click on Ian
  document.getElementById("ian").onclick = () => {
    let base = 1;
    base += 0.5 * rebirths[currentWorld];
    clicks += base;
    updateUI();
    saveGame();
  };
}

function formatNumber(num) {
  if (num < 1000000) return Math.floor(num).toLocaleString();
  const units = ["M", "B", "T", "Q"];
  let unitIndex = -1;
  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }
  return num.toFixed(1) + units[unitIndex];
}

// Save every 10s
setInterval(saveGame, 10000);
// Load when ready
window.onload = loadGame;
