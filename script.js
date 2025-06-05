let clicks = 0;
let rebirths = 0;
let multiplier = 1;
let buyAmount = 1;

const upgrades = {
  cursor: { count: 0, basePrice: 10, baseCPS: 1, icon: 'iancursor.png' },
  miner: { count: 0, basePrice: 100, baseCPS: 5, icon: 'ianminer.png' },
  robot: { count: 0, basePrice: 500, baseCPS: 10, icon: 'ianrobot.png' }
};

function updateDisplay() {
  document.getElementById("click-counter").textContent = `${clicks.toLocaleString()} Clicks`;
  updateRebirthButton();
}

function updateRebirthButton() {
  const btn = document.getElementById("rebirth-btn");
  if (clicks >= 100000) {
    btn.classList.add("available");
    btn.classList.remove("disabled");
    btn.disabled = false;
  } else {
    btn.classList.remove("available");
    btn.classList.add("disabled");
    btn.disabled = true;
  }
}

function getUpgradePrice(upgrade, count) {
  return Math.floor(upgrade.basePrice * Math.pow(1.5, count));
}

function addUpgradeIcon(id, iconPath) {
  const container = document.getElementById(id);
  const img = document.createElement("img");
  img.src = iconPath;
  container.appendChild(img);
}

document.getElementById("ian-img").addEventListener("click", () => {
  clicks += multiplier;
  updateDisplay();
});

document.getElementById("buy-multiplier").addEventListener("change", (e) => {
  buyAmount = parseInt(e.target.value);
});

document.getElementById("rebirth-btn").addEventListener("click", () => {
  if (clicks >= 100000) {
    clicks = 0;
    multiplier += 0.5;
    for (let key in upgrades) {
      upgrades[key].count = 0;
      document.getElementById(`${key}-icons`).innerHTML = "";
    }
    rebirths++;
    updateDisplay();
  }
});

function tryPurchase(key) {
  for (let i = 0; i < buyAmount; i++) {
    const upg = upgrades[key];
    const price = getUpgradePrice(upg, upg.count);
    if (clicks >= price && upg.count < 50) {
      clicks -= price;
      upg.count++;
      multiplier += upg.baseCPS * 0.5;
      addUpgradeIcon(`${key}-icons`, upg.icon);
    }
  }
  updateDisplay();
}

document.getElementById("cursor-upgrade").addEventListener("click", () => tryPurchase("cursor"));
document.getElementById("miner-upgrade").addEventListener("click", () => tryPurchase("miner"));
document.getElementById("robot-upgrade").addEventListener("click", () => tryPurchase("robot"));

updateDisplay();
