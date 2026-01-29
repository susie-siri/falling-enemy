document.addEventListener("DOMContentLoaded", () => {

  /* ---------- SCREENS ---------- */
  const screens = document.querySelectorAll(".screen");
  const home = document.querySelector(".home");
  const characters = document.querySelector(".characters");
  const themes = document.querySelector(".themes");
  const game = document.querySelector(".game");

  /* ---------- BUTTONS ---------- */
  const playBtn = document.getElementById("playBtn");
  const cards = document.querySelectorAll(".card");
  const themeBtns = document.querySelectorAll(".themeBtn");

  const pauseBtn = document.getElementById("pauseBtn");
  const pauseMenu = document.getElementById("pauseMenu");
  const resumeBtn = document.getElementById("resumeBtn");

  const backBtn = document.getElementById("backBtn");
  const restartBtn = document.getElementById("restartBtn");

  /* ---------- GAME OBJECTS ---------- */
  const gameArea = document.querySelector(".game-area");
  const player = document.getElementById("player");
  const enemy = document.getElementById("enemy");
  const goal = document.getElementById("goal");

  const scoreText = document.getElementById("score");
  const endMenu = document.getElementById("endMenu");
  const endText = document.getElementById("endText");

  /* ---------- GAME STATE ---------- */
  let x = 20, y = 360;
  let ex = 200, ey = 60;
  let dir = 1;
  let score = 0;
  let paused = false;
  let gameOver = false;
  let enemyLoop = null;
 let lives = 3;
let canBeHit = true;


  /* ---------- SCREEN SWITCH ---------- */
  function showScreen(screen) {
    screens.forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  /* ---------- FLOW ---------- */
  playBtn.onclick = () => showScreen(characters);

  cards.forEach(card => {
    card.onclick = () => {
      player.src = card.src;
      showScreen(themes);
    };
  });

  themeBtns.forEach(btn => {
    btn.onclick = () => {
      gameArea.className = "game-area " + btn.dataset.theme;
      showScreen(game);
      startGame();
    };
  });

  /* ---------- START / RESTART ---------- */
  function startGame() {
    gameOver = false;
    paused = false;
    dir = 1;
    score = 0;

    scoreText.textContent = "Score: 0";

 lives = 3;
document.getElementById("lives").textContent = "❤️❤️❤️";
canBeHit = true;

    endMenu.classList.add("hidden");
    pauseMenu.classList.add("hidden");

    x = 20; 
    y = 360;
    ex = 200; 
    ey = 60;

    player.style.left = x + "px";
    player.style.top = y + "px";
    enemy.style.left = ex + "px";
    enemy.style.top = ey + "px";

    clearInterval(enemyLoop);
    enemyLoop = setInterval(moveEnemy, 20);
  }

  /* ---------- ENEMY MOVEMENT ---------- */
  function moveEnemy() {
  if (paused || gameOver) return;

  // enemy follows player
  if (ex < x) ex += 1.2;
  if (ex > x) ex -= 1.2;
  if (ey < y) ey += 1.2;
  if (ey > y) ey -= 1.2;

  enemy.style.left = ex + "px";
  enemy.style.top = ey + "px";

  // attack
  if (hit(player, enemy) && canBeHit) {
    takeDamage();
  }
}

  /* ---------- PLAYER MOVEMENT ---------- */
  document.addEventListener("keydown", e => {
    if (paused || gameOver) return;

    if (e.key === "ArrowLeft") x -= 10;
    if (e.key === "ArrowRight") x += 10;
    if (e.key === "ArrowUp") y -= 10;
    if (e.key === "ArrowDown") y += 10;

    x = Math.max(0, Math.min(280, x));
    y = Math.max(0, Math.min(380, y));

    player.style.left = x + "px";
    player.style.top = y + "px";

    if (hit(player, goal)) win();
  });

  /* ---------- COLLISION ---------- */
  function hit(a, b) {
    return (
      a.offsetLeft < b.offsetLeft + b.offsetWidth &&
      a.offsetLeft + a.offsetWidth > b.offsetLeft &&
      a.offsetTop < b.offsetTop + b.offsetHeight &&
      a.offsetTop + a.offsetHeight > b.offsetTop
    );
  }

  /* ---------- GAME END ---------- */
  function win() {
    gameOver = true;
    score += 10;
    scoreText.textContent = "Score: " + score;
    endText.textContent = "YOU WIN 🎉";
    endMenu.classList.remove("hidden");
    clearInterval(enemyLoop);
  }

  function lose() {
    gameOver = true;
    endText.textContent = "GAME OVER 💀";
    endMenu.classList.remove("hidden");
    clearInterval(enemyLoop);
  }

  /* ---------- PAUSE ---------- */
  pauseBtn.onclick = () => {
    if (gameOver) return;
    paused = true;
    pauseMenu.classList.remove("hidden");
  };

  resumeBtn.onclick = () => {
    paused = false;
    pauseMenu.classList.add("hidden");
  };

  /* ---------- END BUTTONS ---------- */
  
 function takeDamage() {
  lives--;
  canBeHit = false;

  document.getElementById("lives").textContent = "❤️".repeat(lives);

  // knockback effect
  x -= 20;
  y += 20;
  player.style.left = x + "px";
  player.style.top = y + "px";

  if (lives <= 0) {
    lose();
  }

  setTimeout(() => {
    canBeHit = true;
  }, 1000);
}

  restartBtn.onclick = startGame;

  backBtn.onclick = () => {
    clearInterval(enemyLoop);
    showScreen(characters);
  };
 
  const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function movePlayer(dx, dy) {
  if (paused || gameOver) return;

  x += dx;
  y += dy;

  x = Math.max(0, Math.min(280, x));
  y = Math.max(0, Math.min(380, y));

  player.style.left = x + "px";
  player.style.top = y + "px";

  if (hit(player, goal)) win();
}

upBtn.addEventListener("touchstart", () => movePlayer(0, -10));
downBtn.addEventListener("touchstart", () => movePlayer(0, 10));
leftBtn.addEventListener("touchstart", () => movePlayer(-10, 0));
rightBtn.addEventListener("touchstart", () => movePlayer(10, 0));
 
});
