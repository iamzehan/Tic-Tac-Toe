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


// We can create a new game
const yname = prompt("Please enter your name: ");
const symbol = ["x", "o"][
  parseInt(prompt("1. x \n2. o\nEnter your symbol: ")) - 1
];
let players = GameBoard.players(yname == "" ? "Player-1" : yname, symbol);
let player = players.getNewPlayer();
let computer = players.getComputer();

console.log(player, computer);
// We can get a new board in every round
for (let round = 1; round <= 5; round++) {
  // with every round now I can get a fresh board
  let board = GameBoard.getFreshBoard();
  console.log("Start of Round - ", round);
  console.log(board);
  board[0][0] = player.symbol;
  board[0][1] = computer.symbol;
  console.log(board);
  console.log("End of Round - ", round);
}

// console.log(player, computer, board);