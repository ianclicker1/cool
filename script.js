let clicks = 0;
let multiplier = 1;

const clickDisplay = document.getElementById('clicks-display');
const ian = document.getElementById('ian');
const rebirthBtn = document.getElementById('rebirth');
const upgrades = document.querySelectorAll('.upgrade');
const multiplierBtn = document.getElementById('multiplier');
const menuBtn = document.getElementById('menu');
const worldsMenu = document.getElementById('worlds-menu');
const closeMenu = document.getElementById('close-menu');

function updateDisplay() {
  clickDisplay.textContent = clicks.toLocaleString() + " Clicks";
}

ian.addEventListener('click', () => {
  clicks += multiplier;
  updateDisplay();
});

rebirthBtn.addEventListener('click', () => {
  if (clicks >= 100000) {
    clicks = 0;
    updateDisplay();
    alert('You Rebirth!');
  }
});

multiplierBtn.addEventListener('click', () => {
  multiplier = multiplier === 1 ? 10 : 1;
  multiplierBtn.textContent = 'x' + multiplier;
});

upgrades.forEach(upg => {
  upg.addEventListener('click', () => {
    const priceText = upg.querySelector('.price').textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
    if (clicks >= price) {
      clicks -= price;
      updateDisplay();
      const newPrice = Math.floor(price * 1.5);
      upg.querySelector('.price').textContent = newPrice + " Clicks";
    }
  });
});

menuBtn.addEventListener('click', () => {
  worldsMenu.style.display = "block";
});

closeMenu.addEventListener('click', () => {
  worldsMenu.style.display = "none";
});
