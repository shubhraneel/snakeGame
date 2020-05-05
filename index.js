let gameSpeed = 100;
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
let scoreVal = document.querySelector(".score--value");

const initialize = () => {
  dir = { x: 1, y: 0 };
  canv.fillStyle = canvasColor;
  canv.fillRect(0, 0, w, h);

  unit = 20;

  snake = [{ x: rand(w), y: rand(h) }];

  apple = { x: rand(w), y: rand(h) };

  appleEaten = false;

  score = 0;
  scoreVal.textContent = score;
};

const turn = (event) => {
  const key = event.key;
  if (
    (key === "w" || key === "ArrowUp" || key === "8" || key === "h") &&
    dir.y === 0
  ) {
    dir.x = 0;
    dir.y = -1;
  } else if (
    (key === "a" || key === "ArrowLeft" || key === "4" || key === "j") &&
    dir.x === 0
  ) {
    dir.x = -1;
    dir.y = 0;
  } else if (
    (key === "s" || key === "ArrowDown" || key === "2" || key === "k") &&
    dir.y === 0
  ) {
    dir.x = 0;
    dir.y = 1;
  } else if (
    (key === "d" || key === "ArrowRight" || key === "6" || key === "l") &&
    dir.x === 0
  ) {
    dir.x = 1;
    dir.y = 0;
  }
};

document.addEventListener("keydown", turn);

const enqueue = (xdir, ydir) => {
  snake.unshift({ x: snake[0].x + xdir * unit, y: snake[0].y + ydir * unit });
  if (snake[0].x >= w) snake[0].x = 0;
  else if (snake[0].x < 0) snake[0].x = w - unit;
  if (snake[0].y >= h) snake[0].y = 0;
  else if (snake[0].y < 0) snake[0].y = h - unit;
  if (snake[0].x === apple.x && snake[0].y === apple.y) appleEaten = true;
};

const drawApple = (apple) => {
  canv.fillStyle = "orangered";
  canv.fillRect(apple.x, apple.y, unit, unit);
};

const clearCanvas = () => {
  canv.fillStyle = canvasColor;

  canv.fillRect(0, 0, w, h);
};

const generateApple = () => {
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

const move = () => {
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

const isDead = () => {
  for (let i = 1; i < snake.length; i++)
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  return false;
};

const draw = () => {
  canv.fillStyle = snakeColor;
  canv.strokeStyle = "black";
  snake.forEach((element) => {
    canv.fillRect(element.x, element.y, unit, unit);
    canv.strokeRect(element.x, element.y, unit, unit);
  });
  canv.fillStyle = snakeHead;
  canv.fillRect(snake[0].x, snake[0].y, unit, unit);
};

const gameEnd = () => {
  gameOver.style.display = "block";
};

document.querySelector(".play-again").addEventListener("click", () => {
  gameOver.style.display = "none";
  document.querySelector(".game-over").style.visibility = "visible";
  initialize();
  requestAnimationFrame(step(0));
});

const step = (t1) => (t2) => {
  if (isDead()) {
    gameEnd();
    return;
  }

  if (t2 - t1 > gameSpeed) {
    move();
    clearCanvas();
    drawApple(apple);
    draw();
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
};

gameOver.style.display = "block";
document.querySelector(".game-over").style.visibility = "hidden";
document.querySelector(".play-again").textContent = "Start game";
clearCanvas();