// Init the board
let theBoard = ["O", 1, 2, "X", "X", "X", "O", 7, "O"]; // The board has been intialized with it's respective indexes 

// Declare the player tokens, you'll need to make
// these random later
const cpuPlayer = "X";
const humanPlayer = "O";

let functionCalls = 0; // keeps track of the number fo function calls

let bestSpot = minimax(theBoard, cpuPlayer);

/* 
This is the backbone of the algorithm it checks the board and plays ahead of the user
by evaluating the board's current state and then choosing the surest set of plays that 
are most probable wins
*/
function minimax(board, thePlayer) {

    functionCalls++;

    let availableSpots = emptySpots(board);

    // Check for terminal states if human wins return -10,
    // if AI wins return +10 if there's no more space on the board 
    // report a tie
    if (winCombos(board, humanPlayer)) {
        return {score: -10};
    } else if (winCombos(board, cpuPlayer)) {
        return {score: 10};
    } else if (availableSpots.length == 0) {
        return {score: 0};
    }

    let moves = []; // For storing move objects

    for (let spot of availableSpots) {
        let move = {}; // store the index of that move as an index

        move.index = board[spot];

        board[spot] = thePlayer;


        // Evaluate the opponent's move score and save it to the move object
        if (thePlayer == cpuPlayer) {
            let result = minimax(board, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(board, cpuPlayer);
            move.score = result.score;
        }

        // Reset the spot to return the board to its original state
        board[spot] = move.index;

        // then push that object into the array of moves
        moves.push(move);
    }

    // Loop through the moves array and select the move with the highest score
    let bestMove;
    if (thePlayer == cpuPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        } 
    } else {
        // Loop through the moves array and select the move with the lowest score
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; //Return the move object from the array

}

// This function checks for empty or available spots
// on the board
function emptySpots(board) {
    let availableSpots = [];
    availableSpots = board.filter(s => s != "X" && s != "O");
    return availableSpots;
}

// You already have this but I needed it for the simulation so you can choose
// which is easier to keep
function winCombos(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player)

    ) {
        return true;
    } else {
        return false;
    }
}


console.log("It works");
console.log(bestSpot);

// console.log(emptySpots(theBoard));

// console.log(winCombos([1, 2, 3, 4, 5, 6, 7, 8, 9]));
