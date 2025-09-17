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

  function mainGamePlayUI(player, computer) {
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

  function playerInput() {
    // manipulating the modals
    const dialogWelcome = document.querySelector(".welcome");
    const dialogContianer = document.querySelector(".container");
    // form
    const form = document.querySelector(".welcome>#form");
    // form inputs
    const select = document.querySelector("#symbols");
    const yname = document.querySelector("#name");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      dialogWelcome.classList.add("animation");
      dialogWelcome.classList.add("hide");
      dialogContianer.classList.add("show");
      symbol = select.value;
      const players = GameBoard.players(
        yname.textContent == "" ? "Player-1" : yname.textContent,
        symbol
      );
      let player = players.getNewPlayer();
      let computer = players.getComputer();
      mainGamePlayUI(player, computer);
    });
  }

  // Add all the functions
  playerInput();
  
}

window.onload = start;
