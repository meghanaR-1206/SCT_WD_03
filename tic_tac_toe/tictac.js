const board = document.querySelectorAll("[data-cell]");
const messageElement = document.getElementById("message");
const historyElement = document.getElementById("history");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const setupDiv = document.getElementById("setup");
const boardDiv = document.getElementById("board");

let player1, player2, roundsToWin;
let currentPlayer = "X";
let gameHistory = [];
let player1Wins = 0;
let player2Wins = 0;
let roundsPlayed = 0;
let gameOver = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startButton.addEventListener("click", () => {
  player1 = document.getElementById("player1").value;
  player2 = document.getElementById("player2").value;
  roundsToWin = parseInt(document.getElementById("rounds").value);

  if (!player1 || !player2 || isNaN(roundsToWin) || roundsToWin < 1) {
    alert("Please enter valid player names and rounds.");
    return;
  }

  setupDiv.classList.add("hidden");
  boardDiv.classList.remove("hidden");
  scoreElement.textContent = `${player1}: ${player1Wins} | ${player2}: ${player2Wins}`;
  startGame();
});

playAgainButton.addEventListener("click", () => {
  resetGame();
});

function startGame() {
  board.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
  currentPlayer = "X";
  messageElement.textContent = `${player1}'s turn (X)`;
  gameOver = false;
}

function handleClick(e) {
  const cell = e.target;
  if (gameOver) return;
  
  placeMark(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    endGame(false, currentPlayer);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function placeMark(cell, mark) {
  cell.textContent = mark;
}

function swapTurns() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  messageElement.textContent = `${currentPlayer === "X" ? player1 : player2}'s turn (${currentPlayer})`;
}

function checkWin(currentMark) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return board[index].textContent === currentMark;
    });
  });
}

function isDraw() {
  return [...board].every((cell) => {
    return cell.textContent === "X" || cell.textContent === "O";
  });
}

function endGame(draw, winner) {
  if (draw) {
    messageElement.textContent = "It's a Draw!";
    addToHistory("Draw");
  } else {
    if (winner === "X") {
      player1Wins++;
    } else {
      player2Wins++;
    }
    messageElement.textContent = `${winner === "X" ? player1 : player2} Wins!`;
    addToHistory(`${winner === "X" ? player1 : player2} Wins!`);
  }

  roundsPlayed++;
  checkGameOver();
  board.forEach((cell) => cell.removeEventListener("click", handleClick));
}

function addToHistory(result) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  historyItem.textContent = `Round ${roundsPlayed + 1}: ${result}`;
  historyElement.appendChild(historyItem);
}

function checkGameOver() {
  scoreElement.textContent = `${player1}: ${player1Wins} | ${player2}: ${player2Wins}`;
  
  if (player1Wins >= roundsToWin || player2Wins >= roundsToWin) {
    setTimeout(() => {
      messageElement.textContent = player1Wins >= roundsToWin ? `${player1} wins the game!` : `${player2} wins the game!`;
      playAgainButton.classList.remove("hidden");
    }, 1000);
    gameOver = true;
  } else {
    setTimeout(resetBoard, 1000);
  }
}

function resetBoard() {
  board.forEach((cell) => {
    cell.textContent = "";
    cell.addEventListener("click", handleClick, { once: true });
  });
  currentPlayer = "X";
  messageElement.textContent = `${player1}'s turn (X)`;
}

function resetGame() {
  player1Wins = 0;
  player2Wins = 0;
  roundsPlayed = 0;
  scoreElement.textContent = "";
  historyElement.innerHTML = "";
  messageElement.textContent = "";
  setupDiv.classList.remove("hidden");
  boardDiv.classList.add("hidden");
  playAgainButton.classList.add("hidden");
}
