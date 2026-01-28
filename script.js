const playBtn = document.getElementById("playBtn");
const home = document.querySelector(".home");
const characters = document.querySelector(".characters");
const game = document.querySelector(".game");
const cards = document.querySelectorAll(".card");

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const gameArea = document.querySelector(".game-area");

const heartsEl = document.getElementById("hearts");
const scoreEl = document.getElementById("score");
const enemyHealthBar = document.getElementById("enemyHealthBar");

const endScreen = document.getElementById("endScreen");
const endMessage = document.getElementById("endMessage");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const selectedText = document.getElementById("selectedCharacter");

let playerX = 135;
let hearts = 3;
let score = 0;
let enemyHealth = 100;
let gameOver = false;

// START GAME
playBtn.onclick = () => {
  home.classList.add("hidden");
  characters.classList.remove("hidden");
};

// CHARACTER SELECT
cards.forEach(card => {
  card.onclick = () => {
    characters.classList.add("hidden");
    game.classList.remove("hidden");
    player.src = card.src;
    selectedText.textContent = "You chose: " + card.dataset.name;
  };
});

// PLAYER MOVE + SHOOT
document.addEventListener("keydown", e => {
  if (gameOver) return;

  if (e.key === "ArrowLeft") playerX -= 20;
  if (e.key === "ArrowRight") playerX += 20;

  playerX = Math.max(0, Math.min(270, playerX));
  player.style.left = playerX + "px";

  if (e.key === " ") shoot();
});

// PLAYER BULLET
function shoot() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 22 + "px";
  bullet.style.top = "330px";
  gameArea.appendChild(bullet);

  const interval = setInterval(() => {
    bullet.style.top = bullet.offsetTop - 8 + "px";

    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    // REAL collision
    if (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    ) {
      enemyHealth -= 20;
      enemyHealthBar.style.width = enemyHealth + "%";
      bullet.remove();
      clearInterval(interval);

      if (enemyHealth <= 0) winGame();
    }

    if (bullet.offsetTop < 0) {
      bullet.remove();
      clearInterval(interval);
    }
  }, 30);
}


// ENEMY BULLET
setInterval(() => {
  if (gameOver) return;

  const bullet = document.createElement("div");
  bullet.className = "enemy-bullet";
  bullet.style.left = enemy.offsetLeft + 28 + "px";
  bullet.style.top = enemy.offsetTop + 60 + "px";
  gameArea.appendChild(bullet);

  const interval = setInterval(() => {
    bullet.style.top = bullet.offsetTop + 6 + "px";

    if (
      bullet.offsetTop > 350 &&
      bullet.offsetLeft > playerX &&
      bullet.offsetLeft < playerX + 50
    ) {
      hearts--;
      heartsEl.textContent = "❤️".repeat(hearts);
      bullet.remove();
      clearInterval(interval);

      if (hearts <= 0) loseGame();
    }

    if (bullet.offsetTop > 420) {
      bullet.remove();
      clearInterval(interval);
    }
  }, 1200);
}, 1200);

// END STATES
function winGame() {
  gameOver = true;
  score = 1;
  scoreEl.textContent = "Score: " + score;
  endMessage.textContent = "YOU WIN 🎉";
  endScreen.classList.remove("hidden");
}

function loseGame() {
  gameOver = true;
  endMessage.textContent = "GAME OVER 💀";
  endScreen.classList.remove("hidden");
}

// BUTTONS
restartBtn.onclick = () => location.reload();
backBtn.onclick = () => location.reload();
