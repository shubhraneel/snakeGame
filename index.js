let gameSpeed = 100;
let gameSpeedDisplay = 1;
let snakeColor = "#81f5ff";
let snakeHead = "#29b0bd";
let canvasColor = "#0c7b93";
let appleColor = "#d11c1c";
let wallColor = "#202080";
let unit = 20;
let nSpace = 5; //space for maze;
let space = 100;
let canvas = document.getElementById("game-canvas");
let w1 = window.matchMedia("(max-width: 1200px)");
let w2 = window.matchMedia("(max-width: 900px)");
let w3 = window.matchMedia("(max-width: 600px)");
let h = parseInt(canvas.getAttribute("height"));
let w = parseInt(canvas.getAttribute("width"));
let canv = canvas.getContext("2d");
let gameOver = document.querySelector(".game-end");
let maze = false;
let autoMode = false;
let ongoingTouch;
let rows = h / unit;
let cols = w / unit;
let aStarUnfinished = false;
let pauseCheckBox = document.querySelector(".checkbox-input__pause");
let gameStop = false;

changeSize();

const rand = (x) => Math.floor((Math.random() * x) / unit) * unit;
const mazeRand = (x) => Math.floor(Math.random() * x);

let dir;
let snake;
let apple;
let appleEaten;
let score;
let pause;
let scoreVal = document.querySelector(".score--value");
let mazeCells = [];
let joinCellsX = [];
let joinCellsY = [];

window.addEventListener("resize", changeSize); //event listener to change canvas height and width

document.addEventListener("keydown", turn);
document.querySelector(".play-buttons").addEventListener("click", controls);
document
  .querySelector(".play-buttons")
  .addEventListener("touchstart", controls);
document
  .querySelector(".speed-buttons")
  .addEventListener("click", speedControl);
document
  .querySelector(".speed-buttons")
  .addEventListener("touchstart", speedControl);
document.querySelector("#checkbox-maze").addEventListener("change", (e) => {
  if (e.target.checked) maze = true;
  else maze = false;
});
document.querySelector("#checkbox-auto").addEventListener("change", (e) => {
  if (e.target.checked) autoMode = true;
  else autoMode = false;
});
document.querySelector(".stop-button").addEventListener("click", () => {
  gameStop = true;
});
document.querySelector(".fa-times").addEventListener( "click", () => {
  document.querySelector("#check-popup").checked = false;
});

gameOver.style.display = "block";
document.querySelector(".game-over").style.display = "none";
document.querySelector(".play-again").textContent = "Start game";
clearCanvas();


function changeSize() {
  if (w3.matches) {
    canvas.setAttribute("width", "300");
    canvas.setAttribute("height", "450");
    h = 450;
    w = 300;
    if (window.matchMedia("(max-height: 700px)").matches) {
      canvas.setAttribute("height", "375");
      h = 375;
    }
    if (window.matchMedia("(max-height: 600px)").matches) {
      canvas.setAttribute("height", "300");
      h = 300;
    } 
    unit = 15;
    space = unit * nSpace;
    clearCanvas();
  } else if (w2.matches) {
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    h = 600;
    w = 600;
    clearCanvas();
  } else if (w1.matches) {
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "800");
    h = 800;
    w = 600;
    clearCanvas();
  } else {
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "500");
    h = 500;
    w = 600;
    clearCanvas();
  }
}

function initialize() {
  dir = { x: 0, y: 0 };
  if (maze) {
    mazeCells = [];
    joinCellsX = [];
    joinCellsY = [];
    space = unit * nSpace;
    mazeGen();
    clearCanvas();

    while (true) {
      snake = [{ x: rand(w), y: rand(h) }];
      if (!mazeCheck(snake[0])) break;
    }
  } else {
    snake = [{ x: rand(w), y: rand(h) }];
  }
  generateApple();

  appleEaten = false;
  document.querySelectorAll(".checkbox-maze__input").forEach(element => {element.disabled = true});

  rows = h / unit;
  cols = w / unit;
  score = 0;
  scoreVal.textContent = score;
  pause = false;
  gameStop = false;
  clearCanvas();
  drawApple(apple);
  draw();
}

function turn(event) {
  const key = event.key;
  if (key === "w" || key === "ArrowUp" || key === "8" || key === "h") {
    up();
  } else if (key === "a" || key === "ArrowLeft" || key === "4" || key === "j") {
    left();
  } else if (key === "s" || key === "ArrowDown" || key === "2" || key === "k") {
    down();
  } else if (
    key === "d" ||
    key === "ArrowRight" ||
    key === "6" ||
    key === "l"
  ) {
    right();
  } else if (key === " ") {
    pause = !pause;
    pauseCheckBox.checked = !pauseCheckBox.checked;
  } else if (key === "=") {
    speedUp();
    document.querySelector(".speed-display").textContent =
      Math.round(gameSpeedDisplay * 10) / 10;
  } else if (key === "-") {
    speedDown();
    document.querySelector(".speed-display").textContent =
      Math.round(gameSpeedDisplay * 10) / 10;
  }
}

function controls(e) {
  const item = e.target;
  console.log(item);
  if (item.classList[1] === "play-top") {
    up();
  } else if (item.classList[1] === "play-left") {
    left();
  } else if (item.classList[1] === "play-right") {
    right();
  } else if (item.classList[1] === "play-bottom") {
    down();
  } else if (
    item.classList[0] === "pause-play" ||
    item.classList[0] === "checkbox-input__pause"
  ) {
    pause = !pause;
  }
}

function up() {
  if (dir.y === 0) {
    dir.x = 0;
    dir.y = -1;
  }
}

function left() {
  if (dir.x === 0) {
    dir.x = -1;
    dir.y = 0;
  }
}

function down() {
  if (dir.y === 0) {
    dir.x = 0;
    dir.y = 1;
  }
}

function right() {
  if (dir.x === 0) {
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
}

function drawApple(apple) {
  canv.fillStyle = "orangered";
  canv.fillRect(apple.x, apple.y, unit, unit);
}

function clearCanvas() {
  if (!maze) {
    canv.fillStyle = canvasColor;
    canv.fillRect(0, 0, w, h);
  } else {
    canv.fillStyle = wallColor;
    canv.fillRect(0, 0, w, h);
    canv.fillStyle = canvasColor;
    paintCells();
    paintJoints();
  }
}

function generateApple() {
  while (true) {
    flag = false;
    apple = { x: rand(w), y: rand(h) };
    snake.forEach((element) => {
      if (apple.x === element.x && apple.y === element.y) {
        flag = true;
      }
    });
    if (maze && !flag) {
      flag = mazeCheck(apple);
    }
    if (!flag) return;
  }
}

function move() {
  enqueue(dir.x, dir.y);
  if (appleEaten) {
    generateApple();
    aStarSearch();
    appleEaten = false;
    score += 10;
    scoreVal.textContent = score;
  } else {
    snake.pop();
  }
}

function isDead() {
  for (let i = 1; i < snake.length; i++)
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  if (maze) {
    if (mazeCheck(snake[0])) return true;
  }
  return false;
}

function draw() {
  canv.fillStyle = snakeColor;
  canv.strokeStyle = "black";
  snake.forEach((element) => {
    canv.fillRect(element.x, element.y, unit, unit);
    canv.strokeRect(element.x, element.y, unit, unit);
  });
  canv.fillStyle = snakeHead;
  canv.fillRect(snake[0].x, snake[0].y, unit, unit);
}

function gameEnd() {
  gameOver.style.display = "block";
  document.querySelectorAll(".checkbox-maze__input").forEach(element => {element.disabled = false;});
}

document.querySelector(".play-again").addEventListener("click", () => {
  initialize();
  document.querySelector(".game-over").style.display = "block";
  document.querySelector(".play-again").style.display = "none";

  if (autoMode) {
    gameOver.style.display = "none";
    document.querySelector(".game-over").textContent = "GAME OVER";
    document.querySelector(".play-again").style.display = "block";
    document.querySelector(".play-again").textContent = "Play again";
    aStarSearch();
    requestAnimationFrame(step(0));
    return;
  }

  document.querySelector(".game-over").textContent = "3";
  setTimeout(() => {
    document.querySelector(".game-over").textContent = "2";
    setTimeout(() => {
      document.querySelector(".game-over").textContent = "1";
      setTimeout(() => {
        document.querySelector(".game-over").textContent =
          "Press or swipe any direction to start";
        setTimeout(() => {
          gameOver.style.display = "none";
          document.querySelector(".game-over").textContent = "GAME OVER";
          document.querySelector(".play-again").style.display = "block";
          document.querySelector(".play-again").textContent = "Play again";
          pause = false;
        }, 1500);
      }, 700);
    }, 700);
  }, 700);

  requestAnimationFrame(step(0));
});

const step = (t1) => (t2) => {
  if (isDead() || gameStop === true) {
    gameEnd();
    gameStop = false;
    return;
  }
  if (!aStarUnfinished && t2 - t1 > gameSpeed && !pause) {
    if (autoMode) setAutoDir();
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
  if (item.classList[0] === "speed-up") {
    speedUp();
  } else if (item.classList[0] === "speed-down") {
    speedDown();
  }
  document.querySelector(".speed-display").textContent =
    Math.round(gameSpeedDisplay * 10) / 10;
}

function speedUp() {
  gameSpeedDisplay += 0.2;
  gameSpeed = Math.round(100 / gameSpeedDisplay);
  if (gameSpeed < 1) {
    gameSpeed = 1;
    gameSpeedDisplay = 100;
  }
}

function speedDown() {
  gameSpeedDisplay -= 0.2;
  if (gameSpeedDisplay <= 0) {
    gameSpeedDisplay = 0.2;
    return;
  }
  gameSpeed = Math.round(100 / gameSpeedDisplay);
}

function mazeGen() {
  let visited = [];
  let neighbours = [];
  let fcell = {
    x: Math.floor((Math.random() * w) / space) * space,
    y: Math.floor((Math.random() * h) / space) * space,
  };
  visited.push(fcell);
  let newNeighbours = genNeighbours(fcell, neighbours);
  neighbours = neighbours.concat(newNeighbours);
  let currCell;
  let visNeighbours = [];
  let joinCell;
  while (neighbours.length > 0) {
    currCell = neighbours.splice(mazeRand(neighbours.length), 1)[0];
    newNeighbours = genNeighbours(currCell, neighbours);
    visNeighbours = [];
    //cannot use filter as unfiltered needs to be pushed in separate array
    newNeighbours.forEach((element) => {
      if (visited.some((e) => e.x === element.x && e.y === element.y))
        visNeighbours.push(element);
      else neighbours.push(element);
    });
    joinCell = visNeighbours[mazeRand(visNeighbours.length)];
    visited.push(currCell);
    breakWalls(currCell, joinCell);
  }
}

function genNeighbours(cell, neighbours) {
  let newNeighbours = [];
  xLeft = cell.x - space;
  xRight = cell.x + space;
  yUp = cell.y - space;
  yDown = cell.y + space;
  if (
    xLeft >= 0 &&
    !neighbours.some((element) => element.x === xLeft && element.y === cell.y)
  )
    newNeighbours.push({ x: xLeft, y: cell.y });
  if (
    xRight <= w &&
    !neighbours.some((element) => element.x === xRight && element.y === cell.y)
  )
    newNeighbours.push({ x: xRight, y: cell.y });
  if (
    yDown <= h &&
    !neighbours.some((element) => element.x === cell.x && element.y === yDown)
  )
    newNeighbours.push({ x: cell.x, y: yDown });
  if (
    yUp >= 0 &&
    !neighbours.some((element) => element.x === cell.x && element.y === yUp)
  )
    newNeighbours.push({ x: cell.x, y: yUp });
  return newNeighbours;
}

function breakWalls(currCell, joinCell) {
  if (currCell.x === joinCell.x) {
    if (currCell.y > joinCell.y) {
      joinCellsY.push({ x: currCell.x, y: currCell.y - unit });
    } else if (currCell.y < joinCell.y) {
      joinCellsY.push({ x: joinCell.x, y: joinCell.y - unit });
    }
  } else if (currCell.y === joinCell.y) {
    if (currCell.x > joinCell.x) {
      joinCellsX.push({ x: currCell.x - unit, y: currCell.y });
    } else if (currCell.x < joinCell.x) {
      joinCellsX.push({ x: joinCell.x - unit, y: joinCell.y });
    }
  }
}

function paintCells() {
  for (x = 0; x < w; x += space) {
    for (y = 0; y < h; y += space) {
      canv.fillRect(x, y, space - unit, space - unit);
    }
  }
}

function paintJoints() {
  joinCellsX.forEach((element) => {
    canv.fillRect(element.x, element.y, unit, space - unit);
  });
  joinCellsY.forEach((element) => {
    canv.fillRect(element.x, element.y, space - unit, unit);
  });
}

function mazeCheck(cell) {
  if (
    (cell.x % space === space - unit || cell.y % space === space - unit) &&
    !joinCellsX.some(
      (element) =>
        cell.x === element.x &&
        cell.y >= element.y &&
        cell.y < element.y + space - unit
    ) &&
    !joinCellsY.some(
      (element) =>
        cell.y === element.y &&
        cell.x >= element.x &&
        cell.x < element.x + space - unit
    )
  )
    return true;
  else return false;
}

//touch controls
document.addEventListener("touchstart", (e) => {
  let touch = e.touches[e.touches.length - 1];
  if (ongoingTouch === undefined) {
    ongoingTouch = copytouch(touch);
  }
});
document.addEventListener("touchmove", (e) => {
  if (ongoingTouch !== undefined) {
    let touches = e.touches;
    let idx;
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === ongoingTouch.identifier) {
        idx = i;
        break;
      }
    }
    // if (
    //   distance(
    //     touches[idx].pageX,
    //     touches[idx].pageY,
    //     ongoingTouch.pageX,
    //     ongoingTouch.pageY
    //   ) >= 3
    // ) {
    swipeControls(
      touches[idx].pageX - ongoingTouch.pageX,
      touches[idx].pageY - ongoingTouch.pageY
    );
    ongoingTouch = undefined;
    // }
  }
});
document.addEventListener("touchend", handleEndCancel);
document.addEventListener("touchcancel", handleEndCancel);
function handleEndCancel(e) {
  if (ongoingTouch !== undefined) {
    let touches = e.changedTouches;
    let idx;
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === ongoingTouch.identifier) {
        idx = i;
        break;
      }
    }
    if (idx === undefined) return;
    else ongoingTouch = undefined;
  }
}
//copytouch to only copy the required properties to prevent unnecesssary memory wastage
function copytouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}
function swipeControls(x, y) {
  let modX = Math.abs(x);
  let modY = Math.abs(y);
  if (y < 0 && modY > 1.1 * modX) up();
  else if (x < 0 && modX > 1.1 * modY) left();
  else if (y > 0 && modY > 1.1 * modX) down();
  else if (x > 0 && modX > 1.1 * modY) right();
}

//priority queue for A* search
class PriorityElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    let priorityElement = new PriorityElement(element, priority);
    let contain = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority < priorityElement.priority) {
        this.items.splice(i, 0, priorityElement);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.items.push(priorityElement);
    }
  }

  dequeue() {
    return this.items.pop();
  }
}

let tempArray = new Array(cols).fill(false);
let tempArray2 = new Array(cols).fill(undefined);
let foundDest = false;
let arr = [];

//manhattan distance
function manDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function aStarSearch() {
  aStarUnfinished = true;
  arr = []; //array to trace path
  foundDest = false;
  let closedList = [];
  let cellSmallestF = [];
  for (let i = 0; i < rows; i++) { closedList.push(tempArray.slice()); cellSmallestF.push(tempArray2.slice())};

  let openList = new PriorityQueue();
  let dest = { i: apple.y / unit, j: apple.x / unit, parent: undefined };
  let initDist = manDistance(
    snake[0].x / unit,
    snake[0].y / unit,
    dest.j,
    dest.i
  );
  let i = snake[0].y / unit;
  let j = snake[0].x / unit;
  let start = {
    i: i,
    j: j,
    g: 0,
    h: initDist,
    f: initDist,
    parent: undefined,
  };
  console.log(start); //!!!!
  console.log(dest); //!!!!
  openList.enqueue(start, start.f);
  cellSmallestF[i][j] = initDist;
  while (openList.items.length > 0) {
    // console.log(JSON.stringify(openList));
    let current = openList.dequeue().element;
    i = current.i;
    j = current.j;
    // alert(current.i + " " + current.j);
    // console.log(i);
    // console.log(j);
    closedList[i][j] = true;
    // console.log(JSON.stringify(closedList));

    let gNew, hNew, fNew, nextI, nextJ;
    for (let k = 0; k < 4; k++) {
      if (k === 0) {
        nextI = i - 1;
        nextJ = j;
      } else if (k === 1) {
        nextI = i;
        nextJ = j - 1;
      } else if (k === 2) {
        nextI = i + 1;
        nextJ = j;
      } else if (k === 3) {
        nextI = i;
        nextJ = j + 1;
      }
      if (nextI >= rows) nextI = 0;
      else if (nextI < 0) nextI = rows - 1;
      if (nextJ >= cols) nextJ = 0;
      else if (nextJ < 0) nextJ = cols - 1;
      gNew = current.g + 1;
      hNew = manDistance(nextJ, nextI, dest.j, dest.i);
      fNew = gNew + hNew;
      console.log(!closedList[nextI][nextJ]);
      if (dest.i === nextI && dest.j === nextJ) {
        dest.parent = current;
        console.log("found"); //!!!!!;
        workPath(dest);
        foundDest = true;
        return;
      } else if (!closedList[nextI][nextJ] && isUnblocked(nextI, nextJ, gNew)) {
        if (cellSmallestF[nextI][nextJ] === undefined || cellSmallestF[nextI][nextJ] > fNew) {
          openList.enqueue(
            {
              i: nextI,
              j: nextJ,
              g: gNew,
              h: hNew,
              f: fNew,
              parent: current,
            },
            fNew
          );
          cellSmallestF[nextI][nextJ] = fNew;
        }
      }
    }
  }
  if (!foundDest) {
    aStarUnfinished = false;
  }
}

function isUnblocked(i, j, g) {
  x = j * unit;
  y = i * unit;
  if (maze && mazeCheck({ x: x, y: y })) return false;
  for (let k = 1; k < snake.length - g; k++)
    if (x === snake[k].x && y === snake[k].y) return false;
  //an exceptional case when the length of the snake is two, the previous check assumes that it can reverse direction 
  if(snake.length === 2 && x === snake[1].x && snake[1].y) return false;  
  return true;
}

function workPath(dest) {
  let element = dest;
  while (element !== undefined) {
    arr.push(element);
    element = element.parent;
  }
  console.log(arr);
  aStarUnfinished = false;
}

function setAutoDir() {
  if (foundDest) {
    let curr = arr.pop();
    let next = arr[arr.length - 1];
    if (next.i === curr.i - 1 || (curr.i === 0 && next.i === rows - 1)) up();
    if (next.j === curr.j - 1 || (curr.j === 0 && next.j === cols - 1)) left();
    if (next.i === curr.i + 1 || (curr.i === rows - 1 && next.i === 0)) down();
    if (next.j === curr.j + 1 || (curr.j === cols - 1 && next.j === 0)) right();
  }
}
