
let clicks = 0;
let clickDisplay = document.getElementById("click-counter");
let ianImage = document.getElementById("ian-image");

ianImage.addEventListener("click", () => {
  clicks++;
  clickDisplay.textContent = clicks.toLocaleString() + " Clicks";
});
