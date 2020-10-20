let L = [
  [1, 1, 1],
  [1, 0, 0],
  [0, 0, 0],
];

let O = [
  [2, 2],
  [2, 2],
];

let T = [
  [3, 3, 3],
  [0, 3, 0],
  [0, 0, 0],
];

let J = [
  [4, 4, 4],
  [0, 0, 4],
  [0, 0, 0],
];

let S = [
  [0, 5, 5],
  [5, 5, 0],
  [0, 0, 0],
];

let Z = [
  [6, 6, 0],
  [0, 6, 6],
  [0, 0, 0],
];

let I = [
  [7, 7, 7, 7],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const tetrominos = [L, O, T, J, S, Z, I];
const colors = [
  "orangered",
  "orange",
  "darkmagenta",
  "darkblue",
  "darkgreen",
  "firebrick",
  "cyan",
];

let board = [];
let tetrominoPosX = 3;
let tetrominoPosY = 0;
let currentTetromino = tetrominos[Math.floor(Math.random() * 7)];
let nextTetromino = tetrominos[Math.floor(Math.random() * 7)];
let speed = 800;
let lines = 0;
let score = 0;
const boardContainer = document.getElementById("container");
const preview = document.getElementById("preview");
const message = document.getElementById("message");

function generateBoard(rows, cols) {
  var result = [];
  for (var i = 0; i < cols; i++) {
    result.push(new Array(rows).fill(0));
  }
  return result;
}

function renderTetromino(posX, posY, tetronimo) {
  for (let y = 0; y < tetronimo.length; y++) {
    for (let x = 0; x < tetronimo[0].length; x++) {
      if (tetronimo[y][x] > 0) {
        if (
          posX + x < board[0].length &&
          posX + x >= 0 &&
          posY + y < board.length &&
          posY + y >= 0
        ) {
          board[posY + y][posX + x] = tetronimo[y][x];
        }
      }
    }
  }
}

function hasCollision(posX, posY, tetronimo) {
  for (let y = 0; y < tetronimo.length; y++) {
    for (let x = 0; x < tetronimo[0].length; x++) {
      if (
        posX + x < board[0].length &&
        posX + x >= 0 &&
        posY + y < board.length &&
        posY + y >= 0
      ) {
        if (board[posY + y][posX + x] > 0 && tetronimo[y][x] > 0) {
          return true;
        }
      }
      if (
        (tetronimo[y][x] > 0 && (posX + x < 0 || posY + y < 0)) ||
        (tetronimo[y][x] > 0 &&
          (posX + x >= board[0].length || posY + y >= board.length))
      ) {
        return true;
      }
    }
  }
  return false;
}

function clearTetromino(posX, posY, tetronimo) {
  for (let y = 0; y < tetronimo.length; y++) {
    for (let x = 0; x < tetronimo[0].length; x++) {
      if (tetronimo[y][x] > 0) {
        board[posY + y][posX + x] = 0;
      }
    }
  }
}

function moveTetromino(incX, incY, tetronimo) {
  clearTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
  if (
    hasCollision(tetrominoPosX + incX, tetrominoPosY + incY, tetronimo) ===
    false
  ) {
    clearTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
    renderTetromino(tetrominoPosX + incX, tetrominoPosY + incY, tetronimo);
    tetrominoPosX += incX;
    tetrominoPosY += incY;
  } else {
    renderTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
    if (incY > 0) {
      removeCompletedLines();
      newTetromino();
    }
  }
}

function newTetromino() {
  tetrominoPosX = 3;
  tetrominoPosY = 0;
  currentTetromino = nextTetromino;
  renderTetromino(tetrominoPosX, tetrominoPosY, currentTetromino);
  nextTetromino = tetrominos[Math.floor(Math.random() * 7)];
  renderBoard(nextTetromino, preview);
}

function isGameOver() {
  return board.every((x) => x.some((e) => e > 0));
}

function removeCompletedLines() {
  let completed = board.filter((x) => x.every((e) => e > 0));
  if (completed.length > 0) {
    speed -= 50;
    lines += completed.length;
    document.getElementById("lines").innerText = lines;
    score += completed.length * 10;
    document.getElementById("score").innerText = score;

    completed.forEach((row) => {
      board.splice(board.indexOf(row), 1);
      board.splice(0, 0, new Array(10).fill(0));
    });
  }
}

function rotateTetromino(tetronimo) {
  clearTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
  let rotatedTetromino = rotateMatrix(tetronimo);
  if (hasCollision(tetrominoPosX, tetrominoPosY, rotatedTetromino) === false) {
    clearTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
    currentTetromino = rotatedTetromino;
    renderTetromino(tetrominoPosX, tetrominoPosY, currentTetromino);
  } else {
    renderTetromino(tetrominoPosX, tetrominoPosY, tetronimo);
  }
}

function rotateMatrix(m) {
  let matrix = [];
  for (i = 0; i < m.length; i++) {
    let a = [];
    for (j = 0; j < m.length; j++) {
      a.push(m[m.length - j - 1][i]);
    }
    matrix.push(a);
  }

  return matrix;
}

function renderBoard(matrix, container) {
  let rows = matrix.length;
  let cols = matrix[0].length;
  container.innerHTML = "";
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = document.createElement("div");
      if (matrix[y][x] > 0) {
        const color = colors[matrix[y][x] - 1];
        cell.style = "background-color:" + color;
      }
      container.appendChild(cell).className = "board-item";
    }
  }
}

function gravity() {
  moveTetromino(0, 1, currentTetromino);
  renderBoard(board, boardContainer);
}

function endGame() {
  message.innerText = "Game over!";
  document.removeEventListener("keydown", onKeyDown);
  document.getElementById("startButton").style.display = "block";
  document.getElementById("startButton").addEventListener("click", newGame);
}

function runner() {
  if (isGameOver()) {
    endGame();
    return;
  }
  gravity();
  setTimeout(function () {
    runner();
  }, speed);
}

function newGame() {
  lines = 0;
  score = 0;
  speed = 800;
  message.innerText = "";
  document.getElementById("startButton").removeEventListener("click", newGame);
  document.getElementById("startButton").style.display = "none";
  document.addEventListener("keydown", onKeyDown);
  board = generateBoard(10, 20);
  newTetromino();
  renderBoard(board, boardContainer);
  runner();
}

board = generateBoard(10, 20);
renderBoard(board, boardContainer);
document.getElementById("startButton").addEventListener("click", newGame);

function onKeyDown(e) {
  if (isGameOver()) {
    endGame();
  }
  var kCode = e && e.which ? e.which : e.keyCode;
  switch (kCode) {
    case 37:
      moveTetromino(-1, 0, currentTetromino);
      renderBoard(board, boardContainer);
      break;
    case 38:
      rotateTetromino(currentTetromino);
      renderBoard(board, boardContainer);
      break;
    case 39:
      moveTetromino(1, 0, currentTetromino);
      renderBoard(board, boardContainer);
      break;
    case 40:
      moveTetromino(0, 1, currentTetromino);
      renderBoard(board, boardContainer);
      break;
  }
}
