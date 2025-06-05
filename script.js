// --- Variables and Constants ---
const ianImg = document.getElementById('ian');
const clickCountEl = document.getElementById('click-count');
const rebirthBtn = document.getElementById('rebirthBtn');
const buyMultiplierBtn = document.getElementById('buyMultiplierBtn');
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');
const worldsPopup = document.getElementById('worldsPopup');
const worldsCloseBtn = document.getElementById('worldsCloseBtn');

const upgradesContainer = document.getElementById('upgrades');

let clicks = 0;
let rebirths = 0;
let buyMultiplier = 1;
let currentWorld = 1;
const maxUpgradeLevel = 50;

// Upgrade data per world
const worlds = {
  1: {
    name: 'Cash World',
    upgrades: [
      { name: 'Ian Cursor', priceBase: 15, img: 'iancursor.png', row: 0 },
      { name: 'Ian Miner', priceBase: 100, img: 'ianminer.png', row: 1 },
      { name: 'Ian Robot', priceBase: 500, img: 'ianrobot.png', row: 2 }
    ],
    bgColor: 'linear-gradient(135deg, #004400 0%, #000000 100%)'
  },
  2: {
    name: 'Mars',
    upgrades: [
      { name: 'Ian Spaceship', priceBase: 1500000, img: 'ianspaceship.png', row: 1 },
      { name: 'Ian Alien', priceBase: 3000000, img: 'ianalien.png', row: 2 },
      { name: 'Ian UFO', priceBase: 5000000, img: 'ianufo.png', row: 2 }
    ],
    bgColor: 'linear-gradient(135deg, #440000 0%, #000000 100%)',
    requirement: 10_000_000
  }
};

let upgrades = [[], [], []]; // rows 0,1,2 each hold upgrade levels

// --- Load/save from localStorage ---
function saveGame() {
  const save = {
    clicks,
    rebirths,
    buyMultiplier,
    currentWorld,
    upgrades
  };
  localStorage.setItem('ianClickerSave', JSON.stringify(save));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem('ianClickerSave'));
  if (save) {
    clicks = save.clicks || 0;
    rebirths = save.rebirths || 0;
    buyMultiplier = save.buyMultiplier || 1;
    currentWorld = save.currentWorld || 1;
    upgrades = save.upgrades || [[], [], []];
  } else {
    upgrades = [[], [], []];
  }
}

// --- Utility functions ---
function formatNumber(num) {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  return (num / 1_000_000_000).toFixed(1) + 'B';
}

function getUpgradePrice(basePrice, level) {
  // Price increases by 1.5x per level, level starts at 0
  return Math.floor(basePrice * Math.pow(1.5, level));
}

function updateBackground() {
  document.body.style.background = worlds[currentWorld].bgColor;
}

// --- Update UI ---
function updateClickCount() {
  clickCountEl.textContent = clicks.toLocaleString();
}

function updateMultiplierButton() {
  buyMultiplierBtn.textContent = `Buy Multiplier: x${buyMultiplier}`;
}

function updateRebirthButton() {
  if (clicks >= 1000000) {
    rebirthBtn.disabled = false;
    rebirthBtn.classList.add('orange');
  } else {
    rebirthBtn.disabled = true;
    rebirthBtn.classList.remove('orange');
  }
}

function clearUpgradesUI() {
  upgradesContainer.innerHTML = '';
}

// Build upgrades UI for current world
function buildUpgradesUI() {
  clearUpgradesUI();

  // Create 3 rows for upgrades
  for (let i = 0; i < 3; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('upgrade-row');
    rowDiv.dataset.row = i;

    upgradesContainer.appendChild(rowDiv);
  }

  const rows = upgradesContainer.querySelectorAll('.upgrade-row');

  // For each upgrade in current world, add button and images for bought upgrades
  worlds[currentWorld].upgrades.forEach((upg, i) => {
    const rowIndex = upg.row;
    const rowDiv = rows[rowIndex];

    // Create buy button
    const level = upgrades[rowIndex][i] || 0;
    const price = getUpgradePrice(upg.priceBase, level);

    const btn = document.createElement('button');
    btn.classList.add('upgrade-button');
    btn.innerHTML = `${upg.name}<br>${formatNumber(price)} Clicks`;
    btn.onclick = () => buyUpgrade(rowIndex, i);

    rowDiv.appendChild(btn);

    // Add icons for purchased upgrades
    for (let n = 0; n < level; n++) {
      const icon = document.createElement('img');
      icon.src = upg.img;
      icon.alt = upg.name;
      icon.title = `${upg.name} level ${n + 1}`;
      rowDiv.appendChild(icon);
    }
  });
}

function buyUpgrade(row, index) {
  const upg = worlds[currentWorld].upgrades[index];
  let level = upgrades[row][index] || 0;
  if (level >= maxUpgradeLevel) return; // max reached

  const price = getUpgradePrice(upg.priceBase, level);

  if (clicks >= price) {
    clicks -= price;
    upgrades[row][index] = level + 1;
    saveGame();
    updateAll();
  }
}

// --- Clicking Ian ---
ianImg.onclick = () => {
  clicks += buyMultiplier;
  saveGame();
  updateAll();
};

// --- Buy Multiplier button ---
buyMultiplierBtn.onclick = () => {
  // Price scales same as upgrades
  const price = 1000 * Math.pow(1.5, buyMultiplier - 1);
  if (clicks >= price) {
    clicks -= price;
    buyMultiplier++;
    saveGame();
    updateAll();
  }
};

// --- Rebirth button ---
rebirthBtn.onclick = () => {
  if (clicks < 1000000) return;

  rebirths++;
  clicks = 0;
  buyMultiplier = 1;
  upgrades = [[], [], []];
  saveGame();
  updateAll();
};

// --- Menu button ---
menuBtn.onclick = () => {
  dropdown.classList.toggle('show');
};

// --- Close dropdown if clicked outside ---
window.onclick = function(event) {
  if (!event.target.matches('#menuBtn')) {
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
};

// --- Worlds menu ---
const worldsMenuLink = document.getElementById('worldsMenuLink');
worldsMenuLink.onclick = () => {
  dropdown.classList.remove('show');
  showWorldsPopup();
};

function showWorldsPopup() {
  worldsPopup.classList.remove('hidden');
  // Reset selections and update UI
  buildWorldsUI();
}

function hideWorldsPopup() {
  worldsPopup.classList.add('hidden');
}

worldsCloseBtn.onclick = () => {
  hideWorldsPopup();
};

function buildWorldsUI() {
  const container = document.getElementById('worldsContainer');
  container.innerHTML = ''; // clear old

  for (const wId in worlds) {
    const world = worlds[wId];

    // Create div for world
    const div = document.createElement('div');
    div.classList.add('world-select');

    const img = document.createElement('img');
    img.src = wId === '1' ? 'world1select.png' : 'world2select.png';
    img.alt = world.name;
    div.appendChild(img);

    const label = document.createElement('p');
    label.style.margin = '0';
    label.style.fontWeight = 'bold';
    label.style.color = 'white';

    // Show (Already Here) if current world
    let labelText = world.name;
    if (parseInt(wId) === currentWorld) {
      labelText += ' (Already Here)';
    }
    label.textContent = labelText;
    div.appendChild(label);

    // Add click handler to switch worlds
    div.onclick = () => {
      if (parseInt(wId) === currentWorld) {
        alert('You are already in this world!');
        return;
      }

      // Check requirements if any
      if (world.requirement && clicks < world.requirement) {
        alert(`You need ${formatNumber(world.requirement)} clicks to enter ${world.name}`);
        return;
      }

      // Switch world
      currentWorld = parseInt(wId);
      saveGame();
      hideWorldsPopup();
      updateAll();
    };

    container.appendChild(div);
