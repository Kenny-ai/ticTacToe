require('./cpu');

let GAME = {
  gameInPlay: false,
  winCombos: [  //game win combinations
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [7, 5, 3]],
  
  //intialize players scores
  playerOneScore: 0,
  playerTwoScore: 0,
  timeOuts: [],
  initializeVars: function () {
    this.numFilledIn = 0;
    this.currentBoard = { //empty-board object
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: '' };

  },

  //intializes game
  initializeGame: function () {
    GAME.initializeVars();
    //board lines are displayed but opacity is 0
    GAME.display.boardLines();
    $('.game-choice button').click(function () {
      GAME.twoPlayers = GAME.gameLogic.gameSelection(this);
      GAME.display.hideGameChoice();
      $(".start-game").fadeIn();

      $('.start-game .choose-x, .start-game .choose-o').off().click(GAME.gameLogic.firstGame);

      $('.back-button').on('click', function () {
        GAME.display.hideStartGame();
        GAME.display.showGameChoice();
      });
    });
    $('.reset').on('click', GAME.gameLogic.resetGame);
  } };



/*Display functions*/

GAME.display = {

  /*hides the game starter*/
  hideStartGame: function() {
    $(".start-game").fadeOut();
  },

  /*shows the game starter*/
  showStartGame: function(isTwoPlayer) {
    let startGamePrompt;
    if (isTwoPlayer) {
      startGamePrompt = "Player 1: Which would you like to be? X or O"; 
    }
    else {
      startGamePrompt = "Which would you like to be? X or O";  /*sets start game message for two players option*/
    }
    setTimeout(function () {
      $('start-game').fadeIn(500).children('p').text(startGamePrompt); 
    }, 700);
  },

  /*shows home window*/
  showGameChoice: function () {
    $('.game-choice').fadeIn(600);
  },

  /*hides home window*/
  hideGameChoice: function () {
    $('.game-choice').fadeOut(600);
  },

  /*player turn display*/
  showPlayerOnePrompt: function () {
    if (GAME.twoPlayers) {
      $('.player-one-turn p').text('Go Player 1!');
    } else
    {
      $('.player-one-turn p').text('Your turn!');
    }
    $('.player-one-turn').animate({ 'top': '-45px' }, 500);
  },

  hidePlayerOnePrompt: function () {
    $('.player-one-turn').animate({ 'top': '0' }, 500);
  },

  showPlayerTwoPrompt: function () {
    if (GAME.twoPlayers) {
      $('.player-two-turn p').text('Go Player 2!');
    } else
    {
      $('.player-two-turn p').text("Computer's turn");
    }
    $('.player-two-turn').animate({ 'top': '-45px' }, 500);
  },
  hidePlayerTwoPrompt: function () {
    $('.player-two-turn').animate({ 'top': '0' }, 500);
  },

  /*win, lose or draw message display */
  showWinMessage: function () {
    GAME.timeOuts.push(
    setTimeout(function () {
      $('.win-message').fadeIn(500).children('p').text("Player " + GAME.turn + " wins!!");
    }, 1500));
  },
  hideWinMessage: function () {
    $(".board-container").click(function() {
      $('.win-message').fadeOut();
    })
   
  },
  showDrawMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $('.draw-message').fadeIn(500);
      }, 1500));
    },
  hideDrawMessage: function () {
    $(".board-container").click(function() {
      $('.draw-message').fadeOut();
    })
  },
  showLoseMessage: function () {
    GAME.timeOuts.push(
    setTimeout(function () {
      $('.lose-message').fadeIn(500);
    }, 1500));

  },
  hideLoseMessage: function () {
    $(".board-container").click(function() {
      $('.draw-message').fadeOut();
    })
  },

  //board drawing
  boardLines: function () {
    GAME.timeOuts.push(setTimeout(function () {
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
      canvas.lineWidth = .5;

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
    }, 1500));
  },

  //create html element for box content
  resetSquares: function () {
    $('.boxes').html('');
    for (let i = 1; i <= 9; i++) {
      let box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
      $(box).appendTo($('.boxes'));
    };
  },

  //scores display
  showScores: function () {
    if (GAME.twoPlayers) {
      $('.score-1').children('.name').text('player1');
      $('.score-2').children('.name').text('player2');
    } else
    {
      $('.score-1').children('.name').text('player1');
      $('.score-2').children('.name').text('computer');
    }
    $('.score-1, .score-2').children('.score').text('0');
    $('.score-1,.score-2, .score-divider').fadeIn();
  },

  //scores update after each game
  updateScore: function (userTurn) {
    let currentScore = userTurn === 1 ? GAME.playerOneScore : GAME.playerTwoScore;
    $('.score-' + GAME.turn).children('.score').text(currentScore);
  } 
};

//game logic
GAME.gameLogic = {

  //random starter
  firstTurn: function() {
    let randomStart = Math.floor(Math.random() * 2 + 1);
    return randomStart;
  },

  //one or two players decider
  gameSelection: function (param) {
    if ($(param).text() === 'One Player') {
      return false;
    } else
    {
      return true;
    }
  },

  //first game
  firstGame: function () {
    GAME.playerOneSymbol = $(this).text();
    GAME.playerTwoSymbol = GAME.playerOneSymbol == 'O' ? 'X' : 'O'; //assigns symbols to each player
    GAME.turn = GAME.gameLogic.firstTurn();
    GAME.display.hideStartGame();
    //set board lines opacity to 1, scores and reset button display
    $('#canvasDesign').animate({ 'opacity': '1' }, 1200); 
    $('.reset').fadeIn(600);
    GAME.display.showScores();
    GAME.display.resetSquares();
    GAME.gameLogic.play();
  },

  //game in play 
  play: function () {
    //symbols display in box on click
    GAME.gameInPlay = true;
    $('.boxes li').on('click', function () {
      GAME.gameLogic.playerTurn(this);
    });
    
    //player-turn prompts after each turn
    GAME.timeOuts.push(setTimeout(function () {
      if (GAME.turn === 1) {
        GAME.display.showPlayerOnePrompt();
      } 
      else if (GAME.turn === 2) {
        GAME.display.showPlayerTwoPrompt();
      }
    }, 1500),
    setTimeout(function () {
      if (GAME.turn === 2 && !GAME.twoPlayers) {
        GAME.gameLogic.computerPlay(); //computerPlay() reference to computer algo
      }
    }, 1200));
  },

  //maintain each player's symbol as turn changes
  playerTurn: function (square) {
    let symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    let box = $(square).children('i').children('span');
    if (box.text() === '' && GAME.gameInPlay && (GAME.turn === 1 || GAME.turn === 2 && GAME.twoPlayers)) {
      box.text(symbol);
      let number = $(square).attr('class');
      GAME.gameLogic.updateSquare(number, symbol);
      GAME.gameLogic.endTurn(symbol);
    }
  },
  //computer algo goes here
  computerPlay: () => {
    console.log(bestSpot);
  },

  //show win or lose message after game ends
  endTurn: function (symbol) {
    GAME.numFilledIn = GAME.numFilledIn + 1;
    if (GAME.gameInPlay) {
      if (GAME.gameLogic.checkWin(symbol)[0]) {
        GAME.gameLogic.updateScore(GAME.turn);
        if (GAME.twoPlayers) {
          GAME.display.showWinMessage();
        } else
        {
          GAME.turn === 1 ? GAME.display.showWinMessage() : GAME.display.showLoseMessage();
        }
        GAME.gameInPlay = false;
        GAME.gameLogic.showWinningCombination();
        GAME.display.hidePlayerOnePrompt();
        GAME.display.hidePlayerTwoPrompt();
        GAME.gameLogic.reset();
      }
      // show draw message if it's a draw
      else if (GAME.numFilledIn >= 9) {
          GAME.gameInPlay = false;
          GAME.display.hidePlayerOnePrompt();
          GAME.display.hidePlayerTwoPrompt();
          GAME.display.showDrawMessage();
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

  //empty game board after every game
  updateSquare: function (number, symbol) {
    GAME.currentBoard[number] = symbol;
  },


  checkWin: function (symbol) {
    let currentBoard = GAME.currentBoard;
    let wins = GAME.winCombos; //access the winCombo array
    let winningCombo = [];

    //check if any of winCombo array elements contains the same symbols
    let winner = wins.some(function (combination) { 
      let winning = true;
      for (let i = 0; i < combination.length; i++) {
        if (currentBoard[combination[i]] !== symbol) {
          winning = false;
        }
      };
      if (winning) {
        winningCombo = combination;
      }
      return winning;
    });
    return [winner, winningCombo]; //return the combination
  },

  //animation for the winning combination
  showWinningCombination: function () {
    let symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    let combo = GAME.gameLogic.checkWin(symbol)[1];
    for (let i = 0; i < combo.length; i++) {
      let currentBox = '.' + combo[i];
      $(currentBox).children('i').addClass('win').children('span').addClass('rotate');
    };
  },

  //update scores after game ends
  updateScore: function (turn) {
    turn === 1 ? GAME.playerOneScore += 1 : GAME.playerTwoScore += 1;
    GAME.display.updateScore(turn);
  },

  //reset board after each game 
  reset: function () {
    GAME.initializeVars();

    GAME.timeOuts.push(setTimeout(function () {
      GAME.display.hideDrawMessage();
      GAME.display.hideLoseMessage();
      GAME.display.hideWinMessage();
      $('.boxes li').fadeOut();
    }, 5000),
    setTimeout(function () {
      GAME.display.resetSquares();
      $('.boxes li').fadeIn();
      GAME.numFilledIn = 0;
    }, 6000),
    
    setTimeout(function () {
      GAME.gameInPlay = true;
      GAME.gameLogic.play();
    }, 6000));
  },

  //reset all
  resetGame: function () {
    $('#canvasDesign').css('opacity', '0');
    $('.reset').fadeOut();
    $('.score-divider, .score-1, .score-2').fadeOut();
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
    $('.draw-message, .win-message, .lose-message').hide();
    GAME.display.hidePlayerOnePrompt();
    GAME.display.hidePlayerTwoPrompt();
    GAME.display.showGameChoice();
  }
};


$(document).ready(function () {
  GAME.initializeGame();
});

