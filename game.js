let data = {
  clicks: 0,
  rebirths: { world1: 0, world2: 0 },
  upgrades: {
    world1: {
      cursor: { level: 0, baseCost: 10, basePower: 1 },
      miner: { level: 0, baseCost: 100, basePower: 5 },
      robot: { level: 0, baseCost: 500, basePower: 10 }
    },
    world2: {
      alien: { level: 0, baseCost: 50, basePower: 2 },
      spaceship: { level: 0, baseCost: 85, basePower: 10 },
      ufo: { level: 0, baseCost: 125, basePower: 20 }
    }
  },
  world: 'world1',
  lastOnline: new Date().toISOString(),
  multiplier: 1
};

let upgradeInfo = {
  world1: [
    ['cursor', 'Ian Cursor'],
    ['miner', 'Ian Miner'],
    ['robot', 'Ian Robot']
  ],
  world2: [
    ['alien', 'Ian Alien'],
    ['spaceship', 'Ian Spaceship'],
    ['ufo', 'Ian UFO']
  ]
};

function saveGame() {
  localStorage.setItem("ianClicker", JSON.stringify(data));
}

function loadGame() {
  const saved = localStorage.getItem("ianClicker");
  if (saved) {
    Object.assign(data, JSON.parse(saved));
    offlineEarnings();
  }
  updateUI();
}

function formatNumber(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function handleClick() {
  data.clicks += getClickPower();
  updateUI();
  saveGame();
}

function getClickPower() {
  const upgrades = data.upgrades[data.world];
  let power = 1;
  for (let key in upgrades) {
    power += upgrades[key].level * (upgrades[key].basePower + 0.5 * upgrades[key].level);
  }
  power += 0.5 * data.rebirths[data.world];
  return power;
}

function updateUI() {
  document.getElementById('clicks').textContent = `Clicks: ${Math.floor(data.clicks).toLocaleString()}`;
  document.getElementById('rebirths-w1').textContent = `Rebirths (World 1): ${data.rebirths.world1}`;
  document.getElementById('rebirths-w2').textContent = `Rebirths (World 2): ${data.rebirths.world2}`;

  document.body.className = data.world;

  const container = document.getElementById('upgrade-buttons');
  container.innerHTML = '';
  const upgrades = data.upgrades[data.world];

  upgradeInfo[data.world].forEach(([key, label]) => {
    const level = upgrades[key].level;
    const cost = upgrades[key].baseCost * Math.pow(2, level) * data.multiplier;
    const power = upgrades[key].basePower + 0.5 * level;

    const btn = document.createElement('button');
    btn.innerText = `${label} x${data.multiplier} (${formatNumber(cost)} clicks) [+${power * data.multiplier}]`;
    btn.onclick = () => buyUpgrade(key);
    if (data.clicks >= cost) {
      btn.className = data.world === 'world1' ? 'green' : 'red';
    } else {
      btn.className = 'disabled';
      btn.disabled = true;
    }
    container.appendChild(btn);
  });

  // Rebirth button style
  const canRebirth = data.clicks >= 100_000;
  const rebirthBtn = document.getElementById('rebirth-btn');
  rebirthBtn.className = canRebirth ? 'available' : '';
  rebirthBtn.disabled = !canRebirth;
}

function buyUpgrade(key) {
  const u = data.upgrades[data.world][key];
  const cost = u.baseCost * Math.pow(2, u.level) * data.multiplier;
  if (data.clicks >= cost) {
    data.clicks -= cost;
    u.level += data.multiplier;
    updateUI();
    saveGame();
  }
}

function setMultiplier(x) {
  data.multiplier = x;
  updateUI();
}

function rebirth() {
  if (data.clicks >= 100_000) {
    data.rebirths[data.world]++;
    data.clicks = 0;
    const upgrades = data.upgrades[data.world];
    for (let key in upgrades) upgrades[key].level = 0;
    saveGame();
    updateUI();
  }
}

function switchWorld() {
  if (data.world === 'world1' && data.clicks < 10_000_000) {
    showPopup('You need 10,000,000 clicks to unlock World 2.');
    return;
  }
  data.world = data.world === 'world1' ? 'world2' : 'world1';
  updateUI();
  saveGame();
}

function showPopup(msg) {
  document.getElementById('popup-msg').innerText = msg;
  document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}

// Offline farming
function offlineEarnings() {
  const last = new Date(data.lastOnline);
  const now = new Date();
  const secs = Math.floor((now - last) / 1000);
  const earn = getClickPower() * secs;
  if (secs > 5) showPopup(`While offline, you earned ${Math.floor(earn).toLocaleString()} clicks!`);
  data.clicks += earn;
  data.lastOnline = now.toISOString();
  saveGame();
}

window.addEventListener('beforeunload', () => {
  data.lastOnline = new Date().toISOString();
  saveGame();
});

setInterval(() => {
  data.clicks += getClickPower();
  updateUI();
}, 1000);

// Initial load
document.getElementById('ian-image').addEventListener('click', handleClick);
loadGame();
