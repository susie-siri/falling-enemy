// ======================
// ELEMENTS
// ======================
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

// MOBILE BUTTONS
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

// ======================
// GAME STATE
// ======================
let playerX = 135;
let hearts = 3;
let score = 0;
let enemyHealth = 100;
let gameOver = false;
let canShoot = true;
let enemyDir = 1;

// ======================
// START GAME
// ======================
function startGame() {
  gameOver = false;
  hearts = 3;
  score = 0;
  enemyHealth = 100;

  playerX = 135;
  player.style.left = playerX + "px";

  heartsEl.textContent = "❤️❤️❤️";
  scoreEl.textContent = "Score: 0";
  enemyHealthBar.style.width = "100%";

  endScreen.classList.add("hidden");

  moveEnemy();
  enemyShootLoop();
}

// ======================
// NAVIGATION
// ======================
playBtn.onclick = () => {
  home.classList.add("hidden");
  characters.classList.remove("hidden");
};

cards.forEach(card => {
  card.onclick = () => {
    characters.classList.add("hidden");
    game.classList.remove("hidden");
    player.src = card.src;
    selectedText.textContent = "You chose: " + card.dataset.name;
    startGame();
  };
});

// ======================
// PLAYER MOVEMENT
// ======================
function moveLeft() {
  if (gameOver) return;
  playerX -= 20;
  playerX = Math.max(0, Math.min(270, playerX));
  player.style.left = playerX + "px";
}

function moveRight() {
  if (gameOver) return;
  playerX += 20;
  playerX = Math.max(0, Math.min(270, playerX));
  player.style.left = playerX + "px";
}

// ======================
// KEYBOARD CONTROLS (LAPTOP)
// ======================
document.addEventListener("keydown", e => {
  if (gameOver) return;

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " " && canShoot) shoot();
});

// ======================
// MOBILE CONTROLS (TOUCH)
// ======================
leftBtn?.addEventListener("touchstart", e => {
  e.preventDefault();
  moveLeft();
});

rightBtn?.addEventListener("touchstart", e => {
  e.preventDefault();
  moveRight();
});

shootBtn?.addEventListener("touchstart", e => {
  e.preventDefault();
  if (canShoot) shoot();
});

// ======================
// PLAYER SHOOT
// ======================
function shoot() {
  canShoot = false;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 22 + "px";
  bullet.style.top = "330px";
  gameArea.appendChild(bullet);

  const interval = setInterval(() => {
    bullet.style.top = bullet.offsetTop - 8 + "px";

    if (checkCollision(bullet, enemy)) {
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

  setTimeout(() => (canShoot = true), 300);
}

// ======================
// ENEMY MOVEMENT
// ======================
function moveEnemy() {
  const interval = setInterval(() => {
    if (gameOver) return clearInterval(interval);

    let x = enemy.offsetLeft + enemyDir * 2;
    if (x <= 0 || x >= 260) enemyDir *= -1;
    enemy.style.left = x + "px";
  }, 20);
}

// ======================
// ENEMY SHOOT
// ======================
function enemyShootLoop() {
  const interval = setInterval(() => {
    if (gameOver) return clearInterval(interval);

    const bullet = document.createElement("div");
    bullet.className = "enemy-bullet";
    bullet.style.left = enemy.offsetLeft + 28 + "px";
    bullet.style.top = enemy.offsetTop + 60 + "px";
    gameArea.appendChild(bullet);

    const move = setInterval(() => {
      bullet.style.top = bullet.offsetTop + 6 + "px";

      if (checkCollision(bullet, player)) {
        hearts--;
        heartsEl.textContent = "❤️".repeat(hearts);
        bullet.remove();
        clearInterval(move);

        if (hearts <= 0) loseGame();
      }

      if (bullet.offsetTop > 420) {
        bullet.remove();
        clearInterval(move);
      }
    }, 30);
  }, 1200);
}

// ======================
// COLLISION
// ======================
function checkCollision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

// ======================
// END STATES
// ======================
function winGame() {
  gameOver = true;
  score++;
  scoreEl.textContent = "Score: " + score;
  endMessage.textContent = "YOU WIN 🎉";
  endScreen.classList.remove("hidden");
}

function loseGame() {
  gameOver = true;
  endMessage.textContent = "GAME OVER 💀";
  endScreen.classList.remove("hidden");
}

// ======================
// BUTTONS
// ======================
restartBtn.onclick = startGame;
backBtn.onclick = () => location.reload();
