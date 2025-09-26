const CreatePlayer = (function () {
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
      name = "Player-2";
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
    players,
  };
})();

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
      return "draw";
    }

    return null; // game not finished
  }

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
    generateTree,
  };
})();

function start() {
  const symbolReference = {
    x: {
      icon: "close",
      "text-shadow": "red",
      message: `Wins!`,
    },
    o: {
      icon: "circle",
      "text-shadow": "green",
      message: `Wins!`,
    },
    draw: {
      icon: "equal",
      message: `It's a Draw!`,
    },
  };

  function setBlinkers(playerInfo, currentPlayer) {
    if (currentPlayer === playerInfo[0].symbol) {
      document.querySelector(".info.one").classList.add("current");
      document.querySelector(".info.two").classList.remove("current");
    } else {
      document.querySelector(".info.one").classList.remove("current");
      document.querySelector(".info.two").classList.add("current");
    }
  }

  function mainGamePlayUI(yname, symbol, info) {
    const players = CreatePlayer.players(
      yname == "" ? "Player-1" : yname,
      symbol
    );
    const playerInfo = [players.getNewPlayer(), players.getComputer()];
    let board = Array(9).fill(" ");
    let currentPlayer = symbol;
    setBlinkers(playerInfo, currentPlayer);
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
          if (result === null) {
            currentPlayer = game.nextPlayer;
            // set the blinkers
            setBlinkers(playerInfo, currentPlayer);
          } else {
            showResult.firstElementChild.firstElementChild.textContent =
              symbolReference[result].icon;
            showResult.firstElementChild.lastElementChild.textContent =
              symbolReference[result].message;
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
