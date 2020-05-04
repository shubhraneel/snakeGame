let gameSpeed = 100;
let snakeColor = "#81f5ff";
let canvasColor = "#0c7b93";
let appleColor = "#d11c1c";
let height = 500;
let width = 1000;

let canvas = document.getElementById("game-canvas");
let h = height;
let w = width;
let canv = canvas.getContext("2d");
let dir = { x: 1, y: 0 };

canv.fillStyle = canvasColor;
canv.fillRect(0, 0, w, h);

let unit = 50;

const rand = (x) => Math.floor((Math.random() * x) / unit) * unit;

let snake = [{ x: rand(w), y: rand(h) }];

let apple = {x: rand(w), y: rand(h)};

let appleEaten = false;

let score = 0;

let scoreVal = document.querySelector(".score--value");
scoreVal.textContent = score;

const turn = event => {
  const key = event.key;
  if ((key === "w" || key === "ArrowUp" || key === "8" || key === "h") && dir.y === 0) {
    dir.x = 0;
    dir.y = -1;
  } else if ((key === "a" || key === "ArrowLeft" || key === "4" || key === "j") && dir.x === 0) {
    dir.x = -1;
    dir.y = 0;
  } else if ((key === "s" || key === "ArrowDown" || key === "2" || key === "k") && dir.y === 0) {
    dir.x = 0;
    dir.y = 1;
  } else if ((key === "d" || key === "ArrowRight" || key === "6" || key === "l") && dir.x === 0) {
    dir.x = 1;
    dir.y = 0;
  }
};

document.addEventListener("keydown", turn);

const enqueue = (xdir, ydir) => {
  snake.unshift({x: snake[0].x + xdir*unit, y: snake[0].y + ydir*unit});
  if(snake[0].x >= w) snake[0].x = 0;
  else if(snake[0].x < 0) snake[0].x = w - unit;
  if(snake[0].y >= h) snake[0].y = 0;
  else if(snake[0].y < 0) snake[0].y = h - unit;
  if(snake[0].x === apple.x && snake[0].y === apple.y)
    appleEaten = true;
};

const drawApple = (apple) => {
  canv.fillStyle = 'orangered';
  canv.fillRect(apple.x, apple.y, unit, unit);
};

drawApple(apple);

function clearCanvas() {
  canv.fillStyle = canvasColor;

  canv.fillRect(0, 0, w, h);
}

const move = () => {
  enqueue(dir.x, dir.y);
  if(appleEaten) {
    apple = {x: rand(w), y: rand(h)};
    appleEaten = false;
    score+=10;
    scoreVal.textContent = score;
  } 
  else {
    snake.pop();
  }
};

const isDead = () => {
  for(let i=1; i < snake.length; i++)
    if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) 
      return true;
  return false;
};

const draw = () => {
  canv.fillStyle = snakeColor;
  snake.forEach(element => {
    canv.fillRect(element.x, element.y, unit, unit);
  });
};

const updateGame = () => {
  if(isDead()) {
    return;
  }
  else {
    setTimeout(()=> {
      clearCanvas();
      move();
      drawApple(apple);
      draw();
      updateGame();
    }, gameSpeed);
  }
};

updateGame();