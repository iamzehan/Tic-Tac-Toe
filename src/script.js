//Let's take an IIFE or module Gameboard which would give us a fresh board on demand
// and create a player along with the computer entity when invoked
const GameBoard = (function () {
  const getFreshBoard = () => {
    let arr = [];
    const n = 3;
    for (let i = 1; i <= n; i++) {
      let inside = [];
      for (let j = 1; j <= n; j++) {
        inside.push("");
      }
      arr.push(inside);
    }
    return arr;
  };

  let players = (playerName, symbol = "") => {
    // private
    let name = "";
    let color = "";
    const getNewPlayer = () => {
      symbol = symbol == "" ? "x" : symbol;
      name = playerName;
      color = "green";
      return { name, symbol, color };
    };

    const getComputer = () => {
      symbol = symbol == "x" ? "o" : "x";
      name = "Player-2";
      color = "red";
      return {
        name,
        symbol,
        color,
      };
    };
    return {
      getNewPlayer,
      getComputer,
    };
  };
  return {
    getFreshBoard,
    players,
  };
})();

// compare win cases to the current
function are2DArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false; // Different number of rows
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false; // Different number of columns in a row
    }
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false; // Elements do not match
      }
    }
  }
  return true; // All elements match
}

const GameController = (function () {
  function checkWinner(board) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let [a, b, c] of wins) {
      if (board[a] !== " " && board[a] === board[b] && board[b] === board[c]) {
        return board[a]; // "X" or "O"
      }
    }

    if (!board.includes(" ")) {
      return "Draw";
    }

    return null; // game not finished
  }

  // Recursive function to generate game tree
  function generateTree(board, player) {
    const winner = checkWinner(board);
    if (winner) {
      return { board: [...board], result: winner, children: [] };
    }
    let nextPlayer;
    let children = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === " ") {
        let newBoard = [...board];
        newBoard[i] = player;
        nextPlayer = player === "x" ? "o" : "x";
      }
    }

    return { board: [...board], nextPlayer, result: null, children };
  }
  return {
    generateTree
  };
})();

function start() {
  const symbolReference = {
    x: {
      icon: "close",
      "text-shadow": "red",
    },
    o: {
      icon: "circle",
      "text-shadow": "green",
    },
  };

  function mainGamePlayUI(yname, symbol, info) {
    const players = GameBoard.players(yname == "" ? "Player-1" : yname, symbol);
    const playerInfo = [players.getNewPlayer(), players.getComputer()];
    let board = Array(9).fill(" ");
    let currentPlayer = symbol;
    try {
      info.forEach((val, index) => {
        val.firstElementChild.textContent = playerInfo[index].name;
        val.lastElementChild.textContent =
          symbolReference[playerInfo[index].symbol].icon;
        val.lastElementChild.style.textShadow = `0px 5px 5px ${
          symbolReference[playerInfo[index].symbol]["text-shadow"]
        }`;
      });
    } catch (error) {
      console.log(error.message);
    }
    // get the cells in the board
    const getCell = document.querySelectorAll(".row .col");
    const showResult = document.querySelector(".result");
    let result;
    getCell.forEach((cell) => {
      cell.addEventListener("click", function inputSymbol() {
        if (cell.firstElementChild.textContent == "" && !result) {
          let idx = cell.getAttribute("data-index");
          board[idx] = currentPlayer;
          cell.firstElementChild.textContent = symbolReference[board[idx]].icon;
          cell.firstElementChild.style.textShadow = `0px 5px 5px ${symbolReference[currentPlayer]["text-shadow"]}`;
          let game = GameController.generateTree(board, currentPlayer);
          result = game.result;
          if (result===null){
            currentPlayer = game.nextPlayer;
          }
          else {
            showResult.firstElementChild.textContent = symbolReference[currentPlayer].icon;
            showResult.showModal();
          }
        } else {
          cell.removeEventListener("click", inputSymbol);
        }
      });
      
      cell.addEventListener("mouseover", () => {
        if (
          (cell.firstElementChild.textContent == "") |
          (cell.firstElementChild.textContent == symbolReference[currentPlayer])
        ) {
          cell.firstElementChild.style.cursor = "pointer";
        } else {
          cell.firstElementChild.style.cursor = "no-drop";
        }
      });
    });
  }

  function playerInput() {
    // manipulating the modals
    const dialoglanding = document.querySelector(".landing");
    const dialogContianer = document.querySelector(".container");
    // form
    const form = document.querySelector(".landing>#form");
    // form inputs
    const select = document.querySelector("#symbols");
    const yname = document.querySelector("#input-name");

    const info = document.querySelectorAll(".info");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      dialoglanding.classList.add("animation");
      dialoglanding.classList.add("hide");
      dialogContianer.classList.add("show");
      info.forEach((e) => e.classList.add("show"));

      try {
        let pname = yname.value;
        let symbol = select.value;
        mainGamePlayUI(pname, symbol, info);
      } catch (error) {
        console.log(error.message);
      }
    });
  }
  // Add all the functions
  playerInput();
}

window.onload = start;