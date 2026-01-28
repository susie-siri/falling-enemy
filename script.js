document.addEventListener("DOMContentLoaded", () => {

  const screens = document.querySelectorAll(".screen");
  const home = document.querySelector(".home");
  const characters = document.querySelector(".characters");
  const themes = document.querySelector(".themes");
  const game = document.querySelector(".game");

  const playBtn = document.getElementById("playBtn");
  const cards = document.querySelectorAll(".card");
  const themeBtns = document.querySelectorAll(".themeBtn");

  const pauseBtn = document.getElementById("pauseBtn");
  const pauseMenu = document.getElementById("pauseMenu");
  const resumeBtn = document.getElementById("resumeBtn");
  const backBtn = document.getElementById("backBtn");

  const endMenu = document.getElementById("endMenu");
  const endText = document.getElementById("endText");
  const restartBtn = document.getElementById("restartBtn");

  const gameArea = document.querySelector(".game-area");
  const player = document.getElementById("player");
  const enemy = document.getElementById("enemy");
  const goal = document.getElementById("goal");

  let x = 20, y = 360;
  let paused = false;
  let gameOver = false;
  let dir = 1;
  let enemyLoop;

  function show(screen) {
    screens.forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  playBtn.onclick = () => show(characters);

  cards.forEach(card => {
    card.onclick = () => {
      player.src = card.src;
      show(themes);
    };
  });

  themeBtns.forEach(btn => {
    btn.onclick = () => {
      gameArea.classList.remove("tech","forest","dungeon","space");
      gameArea.classList.add(btn.dataset.theme);
      show(game);
      start();
    };
  });

  function start() {
    paused = false;
    gameOver = false;
    pauseMenu.classList.add("hidden");
    endMenu.classList.add("hidden");

    x = 20; y = 360;
    player.style.left = x + "px";
    player.style.top = y + "px";

    enemy.style.left = "200px";
    enemy.style.top = "60px";

    clearInterval(enemyLoop);
    enemyLoop = setInterval(moveEnemy, 20);
  }

  function moveEnemy() {
    if (paused || gameOver) return;
    let ex = enemy.offsetLeft + dir * 2;
    if (ex <= 0 || ex >= 285) dir *= -1;
    enemy.style.left = ex + "px";
  }

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

    if (hit(player, goal)) end("YOU ESCAPED 🎉");
    if (hit(player, enemy)) end("ENEMY GOT YOU 💀");
  });

  function hit(a, b) {
    return (
      a.offsetLeft < b.offsetLeft + b.offsetWidth &&
      a.offsetLeft + a.offsetWidth > b.offsetLeft &&
      a.offsetTop < b.offsetTop + b.offsetHeight &&
      a.offsetTop + a.offsetHeight > b.offsetTop
    );
  }

  function end(text) {
    gameOver = true;
    endText.textContent = text;
    endMenu.classList.remove("hidden");
  }

  pauseBtn.onclick = () => {
    paused = true;
    pauseMenu.classList.remove("hidden");
  };

  resumeBtn.onclick = () => {
    paused = false;
    pauseMenu.classList.add("hidden");
  };

  backBtn.onclick = () => {
    clearInterval(enemyLoop);
    show(characters);
  };

  restartBtn.onclick = start;
});
