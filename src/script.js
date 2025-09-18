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
      name = "Computer";
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

function start() {
  let symbolReference = {
    x: "close",
    o: "circle",
  };

  function mainGamePlayUI(yname, symbol, info) {
    const players = GameBoard.players(yname == "" ? "Player-1" : yname, symbol);
    let board = GameBoard.getFreshBoard()
    const player = players.getNewPlayer();
    const computer = players.getComputer();
    const playerinfo = [player, computer];

    try {
      info.forEach((val, index) => {
        val.firstElementChild.textContent = playerinfo[index].name;
        val.lastElementChild.textContent =
          symbolReference[playerinfo[index].symbol];
      });
    } catch (error) {
      console.log(error.message);
    }
    // get the cells in the board
    const getCell = document.querySelectorAll(".row .col");
    let maxMove = 0;

    getCell.forEach((cell) => {
      cell.addEventListener("click", function inputSymbol() {
        try{console.log(maxMove+1);}catch(e){console.log(e.message)};
        if (cell.firstElementChild.textContent == "" && maxMove<5) {
          console.log(board);
          let idx = cell
            .getAttribute("data-index")
            .split("")
            .map((n) => parseInt(n-1));
          board[idx[0]][idx[1]] = player.symbol;
          cell.firstElementChild.textContent = symbolReference[board[idx[0]][idx[1]]];
          cell.firstElementChild.style.textShadow = `0px 5px 5px ${player.color}`;
          maxMove+=1;
        }
        else {
          cell.removeEventListener('click', inputSymbol);
        }
      });
      cell.addEventListener("mouseover", () => {
        if (
          (cell.firstElementChild.textContent == "") |
          (cell.firstElementChild.textContent == symbolReference[player.symbol])
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
