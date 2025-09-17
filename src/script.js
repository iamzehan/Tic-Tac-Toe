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

    const getNewPlayer = () => {
      symbol = symbol == "" ? "x" : symbol;
      name = playerName;
      return { name, symbol };
    };

    const getComputer = () => {
      symbol = symbol == "x" ? "o" : "x";
      name = "Computer";
      return {
        name,
        symbol,
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

function start() {
  let symbolReference = {
    x: "close",
    o: "circle",
  };
  let yname;
  let symbol = "o";
  let players = GameBoard.players(yname == "" ? "Player-1" : yname, symbol);
  let player = players.getNewPlayer();
  let computer = players.getComputer();
  const getCell = document.querySelectorAll(".row .col i");
  getCell.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (cell.textContent == "")
        cell.textContent = symbolReference[player.symbol];
    });
    cell.addEventListener("mouseover", () => {
      if (
        (cell.textContent == "") |
        (cell.textContent == symbolReference[player.symbol])
      ) {
        cell.style.cursor = pointer;
      } else {
        cell.style.cursor = "no-drop";
      }
    });
  });
}

window.onload = start;
