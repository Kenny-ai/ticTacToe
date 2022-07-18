let GAME = {
  gameInPlay: false,
  winCombos: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3],
  ],

  playerOneScore: 0,
  playerTwoScore: 0,
  timeOuts: [],
  initializeVars: function () {
    this.numFilledIn = 0;
    this.currentBoard = {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
    };
  },
  initializeGame: function () {
    GAME.initializeVars();
    GAME.display.boardLines();
    $(".game-choice button").click(function () {
      GAME.twoPlayers = GAME.gameLogic.gameSelection(this);
      GAME.display.hideGameChoice();
      GAME.display.showStartGame();

      $(".start-game .choose-x, .start-game .choose-o")
        .off()
        .click(GAME.gameLogic.firstGame);

      $(".back-button").on("click", function () {
        GAME.display.hideStartGame();
        GAME.display.showGameChoice();
      });
    });
    $(".reset").on("click", GAME.gameLogic.resetGame);
  },
};

GAME.display = {
  hideStartGame: function () {
    $(".start-game").fadeOut();
  },
  showStartGame: function () {
    let startGamePrompt;
    if (GAME.twoPlayers) {
      startGamePrompt = "Player 1: Which would you like to be? X or O";
    } else {
      startGamePrompt = "Which would you like to be? X or O";
    }
    $("start-game").children("p").text(startGamePrompt);
    $(".start-game").fadeIn();
  },

  showGameChoice: function () {
    $(".game-choice").fadeIn(600);
  },

  hideGameChoice: function () {
    $(".game-choice").fadeOut(600);
  },

  showPlayerOnePrompt: function () {
    if (GAME.twoPlayers) {
      $(".player-one-turn p").text("Go Player 1!");
    } else {
      $(".player-one-turn p").text("Your turn!");
    }
    $(".player-one-turn").animate({ top: "-45px" }, 500);
  },

  hidePlayerOnePrompt: function () {
    $(".player-one-turn").animate({ top: "0" }, 500);
  },

  showPlayerTwoPrompt: function () {
    if (GAME.twoPlayers) {
      $(".player-two-turn p").text("Go Player 2!");
    } else {
      $(".player-two-turn p").text("Computer's turn");
    }
    $(".player-two-turn").animate({ top: "-45px" }, 500);
  },
  hidePlayerTwoPrompt: function () {
    $(".player-two-turn").animate({ top: "0" }, 500);
  },
  showWinMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".win-message")
          .fadeIn(500)
          .children("p")
          .text("Player " + GAME.turn + " wins!!");
      }, 1500)
    );
  },
  hideWinMessage: function () {
    $(".board-container").click(function () {
      $(".win-message").fadeOut();
    });
  },
  showDrawMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".draw-message").fadeIn(500);
      }, 1500)
    );
  },
  hideDrawMessage: function () {
    $(".board-container").click(function () {
      $(".draw-message").fadeOut();
    });
  },
  showLoseMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".lose-message").fadeIn(500);
      }, 1500)
    );
  },
  hideLoseMessage: function () {
    $(".board-container").click(function () {
      $(".lose-message").fadeOut();
    });
  },
  boardLines: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        var c = document.getElementById("canvasDesign");
        var canvas = c.getContext("2d");
        canvas.lineWidth = 1;
        canvas.strokeStyle = "white";
        //vertical lines
        canvas.beginPath();
        canvas.moveTo(100, 0);
        canvas.lineTo(100, 146.5);
        canvas.closePath();
        canvas.stroke();
        canvas.beginPath();
        canvas.moveTo(200, 0);
        canvas.lineTo(200, 146.5);
        canvas.closePath();
        canvas.stroke();

        // horizontal lines
        canvas.lineWidth = 0.5;

        canvas.beginPath();
        canvas.moveTo(4, 48.5);
        canvas.lineTo(296, 48.5);
        canvas.closePath();
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(4, 98.5);
        canvas.lineTo(296, 98.5);
        canvas.closePath();
        canvas.stroke();
      }, 1500)
    );
  },
  resetSquares: function () {
    $(".boxes").html("");
    for (let i = 1; i <= 9; i++) {
      let box =
        '<li class="' + i + '"><i class="letter"><span></span></i></li>';
      $(box).appendTo($(".boxes"));
    }
  },
  showScores: function () {
    if (GAME.twoPlayers) {
      $(".score-1").children(".name").text("player1");
      $(".score-2").children(".name").text("player2");
    } else {
      $(".score-1").children(".name").text("player1");
      $(".score-2").children(".name").text("computer");
    }
    $(".score-1, .score-2").children(".score").text("0");
    $(".score-1,.score-2, .score-divider").fadeIn();
  },
  updateScore: function (userTurn) {
    let currentScore =
      userTurn === 1 ? GAME.playerOneScore : GAME.playerTwoScore;
    $(".score-" + GAME.turn)
      .children(".score")
      .text(currentScore);
  },
};

GAME.gameLogic = {
  firstTurn: function () {
    let randomStart = Math.floor(Math.random() * 2 + 1);
    return randomStart;
  },
  gameSelection: function (param) {
    if ($(param).text() === "One Player") {
      return false;
    } else {
      return true;
    }
  },
  firstGame: function () {
    GAME.playerOneSymbol = $(this).text();
    GAME.playerTwoSymbol = GAME.playerOneSymbol == "X" ? "O" : "X";
    GAME.turn = GAME.gameLogic.firstTurn();
    GAME.display.hideStartGame();
    $("#canvasDesign").animate({ opacity: "1" }, 1200);
    $(".reset").fadeIn(600);
    GAME.display.showScores();
    GAME.display.resetSquares();
    GAME.gameLogic.play();
  },
  play: function () {
    GAME.gameInPlay = true;
    $(".boxes li").on("click", function () {
      GAME.gameLogic.playerTurn(this);
    });

    GAME.timeOuts.push(
      setTimeout(function () {
        if (GAME.turn === 1) {
          GAME.display.showPlayerOnePrompt();
        } else if (GAME.turn === 2) {
          GAME.display.showPlayerTwoPrompt();
        }
      }, 1500),
      setTimeout(function () {
        if (GAME.turn === 2 && !GAME.twoPlayers) {
          GAME.gameLogic.computerPlay();
        }
      }, 1200)
    );
  },
  playerTurn: function (square) {
    let symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    let box = $(square).children("i").children("span");
    if (
      box.text() === "" &&
      GAME.gameInPlay &&
      (GAME.turn === 1 || (GAME.turn === 2 && GAME.twoPlayers))
    ) {
      box.text(symbol);
      let number = $(square).attr("class");
      GAME.gameLogic.updateSquare(number, symbol);
      GAME.gameLogic.endTurn(symbol);
    }
  },
  /*computer algo */
  computerPlay: function () {
    var computer = GAME.computer;
    //test computer move suggestion
    var boxNumber;
    if (computer.computerWhichMove(GAME.gameLogic) && GAME.turn === 2) {
      boxNumber = computer.computerWhichMove(GAME.gameLogic);
      var currentBox = $("." + boxNumber).children("i");

      var symbol = GAME.playerTwoSymbol;

      GAME.timeOuts.push(
        setTimeout(function () {
          currentBox.children("span").text(symbol);
          GAME.gameLogic.updateSquare(boxNumber, GAME.playerTwoSymbol);
          GAME.gameLogic.endTurn(symbol);
        }, 1000)
      );
    }
  },
  endTurn: function (symbol) {
    GAME.numFilledIn = GAME.numFilledIn + 1;
    if (GAME.gameInPlay) {
      if (GAME.gameLogic.checkWin(symbol)[0]) {
        GAME.gameLogic.updateScore(GAME.turn);
        if (GAME.twoPlayers) {
          GAME.display.showWinMessage();
        } else {
          GAME.turn === 1
            ? GAME.display.showWinMessage()
            : GAME.display.showLoseMessage();
        }
        GAME.gameInPlay = false;
        GAME.gameLogic.showWinningCombination();
        GAME.display.hidePlayerOnePrompt();
        GAME.display.hidePlayerTwoPrompt();
        GAME.gameLogic.reset();
      }
      // stop if it is a draw
      else if (GAME.numFilledIn === 9) {
        GAME.gameInPlay = false;
        GAME.display.hidePlayerOnePrompt();
        GAME.display.hidePlayerTwoPrompt();
        GAME.display.showDrawMessage();
        // GAME.display.hideDrawMessage();
        GAME.turn = GAME.gameLogic.firstTurn();
        GAME.gameLogic.reset();
      } else {
        if (GAME.turn === 1) {
          GAME.display.hidePlayerOnePrompt();
          GAME.display.showPlayerTwoPrompt();
          GAME.turn = 2;
          // call computer turn if no second player
          if (!GAME.twoPlayers) {
            GAME.gameLogic.computerPlay();
          }
        } else if (GAME.turn === 2) {
          GAME.display.showPlayerOnePrompt();
          GAME.display.hidePlayerTwoPrompt();
          GAME.turn = 1;
        }
      }
    }
  },
  updateSquare: function (number, symbol) {
    GAME.currentBoard[number] = symbol;
  },
  checkWin: function (symbol) {
    let currentBoard = GAME.currentBoard;
    let wins = GAME.winCombos;
    let winningCombo = [];
    let winner = wins.some(function (combination) {
      let winning = true;
      for (let i = 0; i < combination.length; i++) {
        if (currentBoard[combination[i]] !== symbol) {
          winning = false;
        }
      }
      if (winning) {
        winningCombo = combination;
      }
      return winning;
    });
    return [winner, winningCombo];
  },
  showWinningCombination: function () {
    let symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    let combo = GAME.gameLogic.checkWin(symbol)[1];
    for (let i = 0; i < combo.length; i++) {
      let currentBox = "." + combo[i];

      $(currentBox)
        .children("i")
        .addClass("win")
        .children("span")
        .addClass("rotate");
    }
  },
  updateScore: function (turn) {
    turn === 1 ? (GAME.playerOneScore += 1) : (GAME.playerTwoScore += 1);

    GAME.display.updateScore(turn);
  },
  reset: function () {
    GAME.initializeVars();

    GAME.timeOuts.push(
      setTimeout(function () {
        GAME.display.hideDrawMessage();
        GAME.display.hideLoseMessage();
        GAME.display.hideWinMessage();
        $(".boxes li").fadeOut();
      }, 1000),

      setTimeout(function () {
        GAME.display.resetSquares();
        $(".boxes li").fadeIn();
        GAME.numFilledIn = 0;
      }, 1000),
      setTimeout(function () {
        GAME.gameInPlay = true;
        GAME.gameLogic.play();
      }, 2000)
    );
  },
  resetGame: function () {
    $("#canvasDesign").css("opacity", "0");
    $(".reset").fadeOut();
    $(".score-divider, .score-1, .score-2").fadeOut();
    GAME.playerOneScore = 0;
    GAME.playerTwoScore = 0;
    GAME.display.resetSquares();
    GAME.initializeVars();
    GAME.gameInPlay = false;
    GAME.playerOneSymbol = null;
    GAME.playerTwoSymbol = null;
    GAME.timeOuts.forEach(function (timer) {
      clearTimeout(timer);
    });
    $(".draw-message, .win-message, .lose-message").hide();
    GAME.display.hidePlayerOnePrompt();
    GAME.display.hidePlayerTwoPrompt();
    GAME.display.showGameChoice();
  },
};

GAME.computer = {
  computerWhichMove: function () {
    var move = this.winOrBlockChoice("win")[0];
    if (!move) {
      move = this.winOrBlockChoice("block")[0];
      console.log(this.winOrBlockChoice("block"));
    }
    if (!move) {
      move = this.doubleThreatChoice("win");
    }
    if (!move) {
      move = this.doubleThreatChoice("block");
    }
    if (!move) {
      move = this.firstPlay();
    }
    if (!move) {
      move = this.playCenter();
    }
    if (!move) {
      move = this.emptyCorner();
    }
    if (!move) {
      move = this.emptySide();
    }
    move = (move && GAME.currentBoard[move]) === "" ? move : false;
    return move;
  },

  winOrBlockChoice: function (choiceType, board) {
    var board = board || GAME.currentBoard;
    if (choiceType === "win") {
      var currentSymbol = GAME.playerTwoSymbol;
      var opponentSymbol = GAME.playerOneSymbol;
    } else if (choiceType === "block") {
      var currentSymbol = GAME.playerOneSymbol;
      var opponentSymbol = GAME.playerTwoSymbol;
    } else {
      return;
    }
    var moves = [];
    GAME.winCombos.forEach(function (combo) {
      var notFound = [];
      var notPlayer = true;
      for (var i = 0; i < combo.length; i++) {
        if (board[combo[i]] !== currentSymbol) {
          if (board[combo[i]] === opponentSymbol) {
            notPlayer = false;
          } else {
            notFound.push(combo[i]);
          }
        }
      }
      if (notFound.length === 1 && notPlayer) {
        var move = notFound[0];
        moves.push(move);
      }
    });
    return moves;
  },

  doubleThreatChoice: function (choiceType) {
    // use winChoice function to test a spot for double threat
    var board = GAME.currentBoard;
    var move;

    if (choiceType === "win") {
      var currentSymbol = GAME.playerTwoSymbol;
      var opponentSymbol = GAME.playerOneSymbol;
    } else if (choiceType === "block") {
      var currentSymbol = GAME.playerOneSymbol;
      var opponentSymbol = GAME.playerTwoSymbol;
    }

    // forced diagonal win on 4th move prevention
    if (board[5] === currentSymbol && GAME.numFilledIn === 3) {
      if (
        (board[1] === opponentSymbol && board[9] === opponentSymbol) ||
        (board[3] === opponentSymbol && board[7] === opponentSymbol)
      ) {
        // Play an edge to block double threat
        move = this.emptySide();
      }
    }

    if (!move && board[5] === opponentSymbol && GAME.numFilledIn === 2) {
      move = this.diagonalSecondAttack();
    }

    if (!move) {
      // clone current board;
      var testBoard = $.extend({}, board);
      for (var i = 1; i <= 9; i++) {
        testBoard = $.extend({}, board);
        if (testBoard[i] === "") {
          testBoard[i] = currentSymbol;
          if (this.winOrBlockChoice(choiceType, testBoard).length >= 2) {
            move = i;
          }
        }
      }
    }
    return move || false;
  },

  diagonalSecondAttack: function () {
    var board = GAME.currentBoard;
    var comp = GAME.playerTwoSymbol;
    var corners = [1, 3, 7, 9];
    for (var i = 0; i < corners.length; i++) {
      if (board[corners[i]] === comp) {
        return 10 - corners[i];
      }
    }
  },

  firstPlay: function () {
    var board = GAME.currentBoard;
    var corners = [1, 3, 7, 9];
    var move;
    if (GAME.numFilledIn === 1) {
      // player plays center
      if (board[5] === GAME.playerOneSymbol) {
        var cornerNum = Math.floor(Math.random() * 4 + 1);
        move = [1, 3, 7, 9][cornerNum];
      }
      //player plays corner, play opposite corner
      else {
        for (var i = 0; i < corners.length; i++) {
          if (GAME.currentBoard[corners[i]] === GAME.playerOneSymbol) {
            move = 5;
          }
        }
      }
    } else if (GAME.numFilledIn === 0) {
      var cornerNum = Math.floor(Math.random() * corners.length + 1);
      move = corners[cornerNum];
    }
    return move ? move : false;
  },

  playCenter: function () {
    if (GAME.currentBoard[5] === "") {
      return 5;
    }
  },
  emptyCorner: function () {
    var board = GAME.currentBoard;
    var corners = [1, 3, 7, 9];
    var move;
    for (var i = 0; i < corners.length; i++) {
      if (board[corners[i]] === "") {
        move = corners[i];
      }
    }
    return move || false;
  },

  emptySide: function () {
    var sides = [2, 4, 6, 8];
    for (var i = 0; i < sides.length; i++) {
      if (GAME.currentBoard[sides[i]] === "") {
        return sides[i];
      }
    }
    return false;
  },
};

$(document).ready(function () {
  GAME.initializeGame();
});
