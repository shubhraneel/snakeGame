let gameSpeed = 100;
let gameSpeedDisplay = 1;
let snakeColor = "#81f5ff";
let snakeHead = "#29b0bd";
let canvasColor = "#0c7b93";
let appleColor = "#d11c1c";
let height = 500;
let width = 1000;
let unit = 20;

let canvas = document.getElementById("game-canvas");
let h = height;
let w = width;
let canv = canvas.getContext("2d");
let gameOver = document.querySelector(".game-end");

const rand = (x) => Math.floor((Math.random() * x) / unit) * unit;

let dir;
let snake;
let apple;
let appleEaten;
let score;
let pause;
let scoreVal = document.querySelector(".score--value");

document.addEventListener("keydown", turn);
document.querySelector(".play-buttons").addEventListener("click", controls);
document.querySelector(".play-buttons").addEventListener("touchstart", controls);
document.querySelector(".speed-buttons").addEventListener("click", speedControl);
document.querySelector(".speed-buttons").addEventListener("tocuhstart", speedControl);

gameOver.style.display = "block";
document.querySelector(".game-over").style.visibility = "hidden";
document.querySelector(".play-again").textContent = "Start game";
clearCanvas();

function initialize() {
  dir = { x: 1, y: 0 };
  canv.fillStyle = canvasColor;
  canv.fillRect(0, 0, w, h);

  unit = 20;

  snake = [{ x: rand(w), y: rand(h) }];

  apple = { x: rand(w), y: rand(h) };

  appleEaten = false;

  score = 0;
  scoreVal.textContent = score;
  pause = false;
};

function turn(event) {
  const key = event.key;
  if (
    key === "w" || key === "ArrowUp" || key === "8" || key === "h"
  ) {
    up();
  } else if (
    key === "a" || key === "ArrowLeft" || key === "4" || key === "j"
  ) {
    left();
  } else if (
    key === "s" || key === "ArrowDown" || key === "2" || key === "k"
  ) {
    down();
  } else if (
    key === "d" || key === "ArrowRight" || key === "6" || key === "l"
  ) {
    right();
  } else if (key === " ") {
      pause = !pause;
  } else if (key === "=") {
      speedUp();
      document.querySelector(".speed-display").textContent = Math.round(gameSpeedDisplay*10)/10;
  } else if (key === "-") {
      speedDown();
      document.querySelector(".speed-display").textContent = Math.round(gameSpeedDisplay*10)/10;
  }
};

function controls(e) {
  const item = e.target;
  console.log(item);
  if(item.classList[1] === "play-top") {
    up();
  } else if(item.classList[1] === "play-left") {
    left();
  } else if(item.classList[1] === "play-right") {
    right();
  } else if(item.classList[1] === "play-bottom") {
    down();
  } else if(item.classList[0] === "pause-play") {
    pause = !pause;
  }
}

function up() {
  if(dir.y === 0)
  {
    dir.x = 0;
    dir.y = -1;
  }
}

function left() {
  if(dir.x === 0)
  {
    dir.x = -1;
    dir.y = 0;
  }
}

function down() {
  if(dir.y === 0)
  {
    dir.x = 0;
    dir.y = 1;
  }
}

function right() {
  if(dir.x === 0)
  {
    dir.x = 1;
    dir.y = 0;
  }
}

function enqueue(xdir, ydir) {
  snake.unshift({ x: snake[0].x + xdir * unit, y: snake[0].y + ydir * unit });
  if (snake[0].x >= w) snake[0].x = 0;
  else if (snake[0].x < 0) snake[0].x = w - unit;
  if (snake[0].y >= h) snake[0].y = 0;
  else if (snake[0].y < 0) snake[0].y = h - unit;
  if (snake[0].x === apple.x && snake[0].y === apple.y) appleEaten = true;
};

function drawApple(apple) {
  canv.fillStyle = "orangered";
  canv.fillRect(apple.x, apple.y, unit, unit);
};

function clearCanvas() {
  canv.fillStyle = canvasColor;

  canv.fillRect(0, 0, w, h);
};

function generateApple() {
  while (true) {
    appleOnSnake = false;
    apple = { x: rand(w), y: rand(h) };
    snake.forEach((element) => {
      if (apple.x === element.x && apple.y === element.y) {
        appleOnSnake = true;
      }
    });
    if (appleOnSnake === false) return apple;
  }
};

function move() {
  enqueue(dir.x, dir.y);
  if (appleEaten) {
    apple = generateApple();
    appleEaten = false;
    score += 10;
    scoreVal.textContent = score;
  } else {
    snake.pop();
  }
};

function isDead() {
  for (let i = 1; i < snake.length; i++)
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  return false;
};

function draw() {
  canv.fillStyle = snakeColor;
  canv.strokeStyle = "black";
  snake.forEach((element) => {
    canv.fillRect(element.x, element.y, unit, unit);
    canv.strokeRect(element.x, element.y, unit, unit);
  });
  canv.fillStyle = snakeHead;
  canv.fillRect(snake[0].x, snake[0].y, unit, unit);
};

function gameEnd() {
  gameOver.style.display = "block";
};

document.querySelector(".play-again").addEventListener("click", () => {
  gameOver.style.display = "none";
  document.querySelector(".game-over").style.visibility = "visible";
  document.querySelector(".play-again").textContent = "Play again";
  initialize();
  requestAnimationFrame(step(0));
});

const step = (t1) => (t2) => {
  if (isDead()) {
    gameEnd();
    return;
  }

  if (t2 - t1 > gameSpeed && pause === false) {
    move();
    clearCanvas();
    drawApple(apple);
    draw();
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
};

function speedControl(e) {
  const item = e.target;
  if(item.classList[0] === "speed-up")
  {
    speedUp();
  }
  else if(item.classList[0] === "speed-down")
  {
    speedDown();
  }
  document.querySelector(".speed-display").textContent = Math.round(gameSpeedDisplay*10)/10;
}

function speedUp() {
  gameSpeedDisplay += 0.2;
  gameSpeed = Math.round(100/gameSpeedDisplay);
  if(gameSpeed < 1)
  {
    gameSpeed = 1;
    gameSpeedDisplay = 100;
  }  
}

function speedDown() {
  gameSpeedDisplay -= 0.2;
  if(gameSpeedDisplay <= 0)
  {
    gameSpeedDisplay = 0.2;
    return;
  }  
  gameSpeed = Math.round(100/gameSpeedDisplay);
}