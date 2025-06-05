let clicks = 0;
let clickPower = 1;
let upgrades = { cursor: 0, miner: 0, robot: 0 };
let rebirths = 0;
let world = 1;
let multiplier = 1;

const clickCount = document.getElementById('click-count');
const ianImg = document.getElementById('ian-img');
const rebirthBtn = document.getElementById('rebirth-btn');
const buyMult = document.getElementById('buy-multiplier');
const menuBtn = document.getElementById('menu-btn');
const worldMenu = document.getElementById('world-menu');
const world1Label = document.getElementById('world1-label');
const world2Label = document.getElementById('world2-label');
const world2Locked = document.getElementById('mars-locked');
const closeWorldMenu = document.getElementById('close-world-menu');

// Offline farming
let lastTime = localStorage.getItem("lastTime") || Date.now();

function saveGame() {
  localStorage.setItem('clicks', clicks);
  localStorage.setItem('clickPower', clickPower);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
  localStorage.setItem('rebirths', rebirths);
  localStorage.setItem('world', world);
  localStorage.setItem('lastTime', Date.now());
}

function loadGame() {
  clicks = Number(localStorage.getItem('clicks')) || 0;
  clickPower = Number(localStorage.getItem('clickPower')) || 1;
  upgrades = JSON.parse(localStorage.getItem('upgrades')) || { cursor: 0, miner: 0, robot: 0 };
  rebirths = Number(localStorage.getItem('rebirths')) || 0;
  world = Number(localStorage.getItem('world')) || 1;
  lastTime = localStorage.getItem('lastTime') || Date.now();
  updateDisplay();
}

function updateDisplay() {
  clickCount.innerText = formatNumber(clicks) + ' Clicks';
  rebirthBtn.classList.toggle('active', clicks >= 100000);
  rebirthBtn.disabled = clicks < 100000;
}

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  return num.toLocaleString();
}

ianImg.onclick = () => {
  clicks += clickPower;
  updateDisplay();
};

rebirthBtn.onclick = () => {
  if (clicks >= 100000) {
    clicks = 0;
    upgrades = { cursor: 0, miner: 0, robot: 0 };
    clickPower = 1 + (rebirths + 1) * 0.5;
    rebirths++;
    updateDisplay();
  }
};

buyMult.onclick = () => {
  const levels = [1, 5, 10, 20];
  const next = levels[(levels.indexOf(multiplier) + 1) % levels.length];
  multiplier = next;
  buyMult.innerText = multiplier + 'x';
};

menuBtn.onclick = () => {
  worldMenu.classList.remove('hidden');
};

closeWorldMenu.onclick = () => {
  worldMenu.classList.add('hidden');
};

document.getElementById('world1-select').onclick = () => {
  world = 1;
  localStorage.setItem('world', world);
  world1Label.innerText = 'Cash World (Already Here)';
  world2Label.innerText = 'Mars';
  document.body.style.background = 'linear-gradient(to bottom right, #003300, #000000)';
  worldMenu.classList.add('hidden');
  updateDisplay();
};

document.getElementById('world2-select').onclick = () => {
  if (clicks >= 10000000) {
    world = 2;
    localStorage.setItem('world', world);
    world2Label.innerText = 'Mars (Already Here)';
    world1Label.innerText = 'Cash World';
    document.body.style.background = 'linear-gradient(to bottom right, #660000, #ffffff)';
    worldMenu.classList.add('hidden');
    updateDisplay();
  }
};

// Offline farming logic
window.onload = () => {
  loadGame();
  const now = Date.now();
  const secondsAway = Math.floor((now - lastTime) / 1000);
  const earned = secondsAway * (upgrades.cursor + upgrades.miner * 5 + upgrades.robot * 10);
  if (earned > 0) {
    clicks += earned;
    document.getElementById('offline-amount').innerText = formatNumber(earned);
    document.getElementById('offline-popup').classList.remove('hidden');
  }
  updateDisplay();
};

function closeOfflinePopup() {
  document.getElementById('offline-popup').classList.add('hidden');
}

setInterval(saveGame, 5000);
