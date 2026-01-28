// ================= ELEMENTS =================
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

const pauseBtn = document.getElementById("pauseBtn");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const charBackBtn = document.getElementById("charBackBtn");

const endMenu = document.getElementById("endMenu");
const endMessage = document.getElementById("endMessage");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const selectedText = document.getElementById("selectedCharacter");

// ================= GAME STATE =================
let playerX = 0;
let hearts = 3;
let score = 0;
let enemyHealth = 100;
let enemyDir = 1;
let enemySpeed = 2;

let paused = false;
let gameOver = false;
let canShoot = true;

let enemyMoveInterval;
let enemyShootInterval;

// ================= START GAME =================
function startGame() {
  hearts = 3;
  score = 0;
  enemyHealth = 100;
  enemySpeed = 2;
  enemyDir = 1;

  paused = false;
  gameOver = false;

  heartsEl.textContent = "❤️❤️❤️";
  scoreEl.textContent = "Score: 0";
  enemyHealthBar.style.width = "100%";

  pauseMenu.classList.add("hidden");
  endMenu.classList.add("hidden");

  playerX = (gameArea.clientWidth - player.offsetWidth) / 2;
  player.style.left = playerX + "px";

  clearIntervals();
  moveEnemy();
  enemyShoot();
}

// ================= CLEAR INTERVALS =================
function clearIntervals() {
  clearInterval(enemyMoveInterval);
  clearInterval(enemyShootInterval);
}

// ================= NAVIGATION =================
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

// ================= PLAYER MOVE =================
function movePlayer(dx) {
  if (paused || gameOver) return;

  const gameWidth = gameArea.clientWidth;
  const playerWidth = player.offsetWidth;

  playerX += dx;

  if (playerX <= 0) playerX = 0;
  if (playerX >= gameWidth - playerWidth) {
    playerX = gameWidth - playerWidth;
  }

  player.style.left = playerX + "px";
}


// ================= KEYBOARD =================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") movePlayer(-20);
  if (e.key === "ArrowRight") movePlayer(20);
  if (e.key === " " && canShoot && !paused) shoot();
  if (e.key === "Escape") pauseGame();
});

// ================= SHOOT =================
function shoot() {
  canShoot = false;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + player.offsetWidth / 2 - 3 + "px";
  bullet.style.top = "330px";
  gameArea.appendChild(bullet);

  const move = setInterval(() => {
    if (paused) return;

    bullet.style.top = bullet.offsetTop - 8 + "px";

    if (collision(bullet, enemy)) {
      enemyHealth -= 20;
      score += 10;
      enemySpeed += 0.3;

      scoreEl.textContent = "Score: " + score;
      enemyHealthBar.style.width = enemyHealth + "%";

      bullet.remove();
      clearInterval(move);

      if (enemyHealth <= 0) endGame("YOU WIN 🎉");
    }

    if (bullet.offsetTop < 0) {
      bullet.remove();
      clearInterval(move);
    }
  }, 30);

  setTimeout(() => (canShoot = true), 300);
}

// ================= ENEMY MOVE =================
function moveEnemy() {
  enemyMoveInterval = setInterval(() => {
    if (paused || gameOver) return;

    const gameWidth = gameArea.clientWidth;
    const enemyWidth = enemy.offsetWidth;

    let x = enemy.offsetLeft + enemyDir * enemySpeed;

    // LEFT EDGE
    if (x <= 0) {
      x = 0;
      enemyDir = 1;
    }

    // RIGHT EDGE
    if (x >= gameWidth - enemyWidth) {
      x = gameWidth - enemyWidth;
      enemyDir = -1;
    }

    enemy.style.left = x + "px";
  }, 20);
}


// ================= ENEMY SHOOT =================
function enemyShoot() {
  enemyShootInterval = setInterval(() => {
    if (paused || gameOver) return;

    const bullet = document.createElement("div");
    bullet.className = "enemy-bullet";
    bullet.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 3 + "px";
    bullet.style.top = enemy.offsetTop + enemy.offsetHeight + "px";
    gameArea.appendChild(bullet);

    const move = setInterval(() => {
      if (paused) return;

      bullet.style.top = bullet.offsetTop + 6 + "px";

      if (collision(bullet, player)) {
        hearts--;
        heartsEl.textContent = "❤️".repeat(hearts);
        bullet.remove();
        clearInterval(move);

        if (hearts <= 0) endGame("GAME OVER 💀");
      }

      if (bullet.offsetTop > gameArea.clientHeight) {
        bullet.remove();
        clearInterval(move);
      }
    }, 30);
  }, 1200);
}

// ================= COLLISION =================
function collision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

// ================= PAUSE / END =================
function pauseGame() {
  if (gameOver) return;
  paused = true;
  pauseMenu.classList.remove("hidden");
}

function endGame(text) {
  gameOver = true;
  endMessage.textContent = text;
  endMenu.classList.remove("hidden");
}

// ================= BUTTONS =================
pauseBtn.onclick = pauseGame;

resumeBtn.onclick = () => {
  paused = false;
  pauseMenu.classList.add("hidden");
};

charBackBtn.onclick = () => {
  paused = false;
  game.classList.add("hidden");
  characters.classList.remove("hidden");
};

restartBtn.onclick = startGame;

homeBtn.onclick = () => location.reload();
