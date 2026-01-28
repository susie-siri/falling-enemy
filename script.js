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

const pauseMenu = document.getElementById("pauseMenu");
const endMenu = document.getElementById("endMenu");
const endMessage = document.getElementById("endMessage");

const resumeBtn = document.getElementById("resumeBtn");
const charBackBtn = document.getElementById("charBackBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const selectedText = document.getElementById("selectedCharacter");

let playerX = 135;
let hearts, score, enemyHealth;
let paused = false;
let gameOver = false;
let enemyDir = 1;
let enemySpeed = 2;
let canShoot = true;

let enemyMoveInt, enemyShootInt;

function startGame() {
  hearts = 3;
  score = 0;
  enemyHealth = 100;
  enemySpeed = 2;
  paused = false;
  gameOver = false;

  playerX = 135;
  player.style.left = playerX + "px";

  heartsEl.textContent = "❤️❤️❤️";
  scoreEl.textContent = "Score: 0";
  enemyHealthBar.style.width = "100%";

  pauseMenu.classList.add("hidden");
  endMenu.classList.add("hidden");

  clearIntervals();
  moveEnemy();
  enemyShoot();
}

function clearIntervals() {
  clearInterval(enemyMoveInt);
  clearInterval(enemyShootInt);
}

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

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move(-20);
  if (e.key === "ArrowRight") move(20);
  if (e.key === " ") shoot();
  if (e.key === "Escape") pause();
});

function move(dx) {
  if (paused || gameOver) return;
  playerX = Math.max(0, Math.min(270, playerX + dx));
  player.style.left = playerX + "px";
}

function shoot() {
  if (!canShoot || paused || gameOver) return;
  canShoot = false;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 22 + "px";
  bullet.style.top = "330px";
  gameArea.appendChild(bullet);

  const loop = setInterval(() => {
    if (paused) return;
    bullet.style.top = bullet.offsetTop - 8 + "px";

    if (hit(bullet, enemy)) {
      enemyHealth -= 20;
      score += 10;
      enemySpeed += 0.3;
      scoreEl.textContent = "Score: " + score;
      enemyHealthBar.style.width = enemyHealth + "%";
      bullet.remove();
      clearInterval(loop);
      if (enemyHealth <= 0) win();
    }

    if (bullet.offsetTop < 0) {
      bullet.remove();
      clearInterval(loop);
    }
  }, 30);

  setTimeout(() => canShoot = true, 300);
}

function moveEnemy() {
  enemyMoveInt = setInterval(() => {
    if (paused || gameOver) return;
    let x = enemy.offsetLeft + enemyDir * enemySpeed;
    if (x <= 0 || x >= 260) enemyDir *= -1;
    enemy.style.left = x + "px";
  }, 20);
}

function enemyShoot() {
  enemyShootInt = setInterval(() => {
    if (paused || gameOver) return;

    const b = document.createElement("div");
    b.className = "enemy-bullet";
    b.style.left = enemy.offsetLeft + 28 + "px";
    b.style.top = enemy.offsetTop + 60 + "px";
    gameArea.appendChild(b);

    const loop = setInterval(() => {
      if (paused) return;
      b.style.top = b.offsetTop + 6 + "px";

      if (hit(b, player)) {
        hearts--;
        heartsEl.textContent = "❤️".repeat(hearts);
        b.remove();
        clearInterval(loop);
        if (hearts <= 0) lose();
      }

      if (b.offsetTop > 420) {
        b.remove();
        clearInterval(loop);
      }
    }, 30);
  }, 1200);
}

function hit(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return r1.left < r2.right && r1.right > r2.left &&
         r1.top < r2.bottom && r1.bottom > r2.top;
}

function pause() {
  if (gameOver) return;
  paused = true;
  pauseMenu.classList.remove("hidden");
}

function win() {
  gameOver = true;
  endMessage.textContent = "YOU WIN 🎉";
  endMenu.classList.remove("hidden");
}

function lose() {
  gameOver = true;
  endMessage.textContent = "GAME OVER 💀";
  endMenu.classList.remove("hidden");
}

resumeBtn.onclick = () => {
  paused = false;
  pauseMenu.classList.add("hidden");
};

charBackBtn.onclick = () => {
  clearIntervals();
  game.classList.add("hidden");
  characters.classList.remove("hidden");
};

restartBtn.onclick = startGame;

homeBtn.onclick = () => {
  clearIntervals();
  game.classList.add("hidden");
  home.classList.remove("hidden");
};
