const gameBoard = (function (){
    // Use this module to control the gameBoard
    let board = ['', '', '', '', '', '', '', '', ''];

    // create factory functions for player
    const Player = (name, letter) => {
        return {
            name,
            letter,
            turns: [],
            pushTurn: function (index) {
                this.turns.push(index);
            },
            checkIfWin: function () {
                for (let i = 0; i < winConditions.length; i++) {
                    const win = winConditions[i].every(index => this.turns.includes(index));
                    if (win) {
                        return {
                            decision: true,
                            winningIndex: winConditions[i]
                        }
                    }
                }
                return false;
            },
            checkIfDraw: function () {
                const win = this.checkIfWin();
                const boardFilled = isBoardFilled();
                if (!win && boardFilled) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    const isBoardFilled = () => {
        return board.every(cell => cell === 'X' || cell === 'O');
    };

    const winConditions = [
        // horizontals
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        // verticals
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        // diagonal
        [0, 4, 8], [2, 4, 6]
    ];

    return {
        addPlayer: function(name, letter) {
            const player = Player(name, letter);
            return player
        },

        insertInBoard: function(letter, index) {
            board[index] = letter;
            console.log(board);
        },

        insertInData: function(player, index) {
            // letter === 'X' ? playerData.playerXTurns.push(index) : playerData.playerOTurns.push(index);
            player.pushTurn(index);
            console.log(player);
            console.log(player.turns);
        },
        
        checkIfEmpty: function(index) {
            if (board[index] !== 'X' && board[index] !== 'O') {
                return true;
            } else {
                return false;
            }
        }

    }

})();

const UIController = (function () {
    // use this module to control the display 

    // return {

    //     }
    
})();

const gameController = (function () {
    // use this module to control the flow of the game, Global app controller

    let gamePlaying;
    let clickCount;
    let playerX;
    let playerO;

    const setupEventListeners = () => {
        document.addEventListener('click', clickCell);
        document.querySelector('#player-form').addEventListener('submit', assignPlayer);
    }

    function clickCell (e) {
        if (gamePlaying) {
            if (e.target.closest('#board')) {
                const cellIndex = parseInt(e.target.id.substr(-1,1));
                if (cellIndex >= 0 && cellIndex <= 8) {
                    let player;
                    clickCount++;
                    console.log(cellIndex);
                    if (clickCount % 2 === 1) {
                        // Player X's turn
                        player = playerX;
                    } else if (clickCount % 2 === 0) {
                        // Player O's turn
                        player = playerO;
                    }
                    pushData(player, cellIndex);
                }
            }
        }
    }

    function pushData (player, cellIndex) {
        // check if board is populated yet
        const isEmpty = gameBoard.checkIfEmpty(cellIndex);
        // insert into the board if empty
        if (isEmpty) {
            gameBoard.insertInBoard(player.letter, cellIndex);
            gameBoard.insertInData(player, cellIndex);
            gameOver(player);
            // checkForWinner(player);
            // checkForDraw(player);
        }
    }      

    function gameOver (player) {
        // loop through array for player X or O 
        const win = player.checkIfWin();
        const draw = player.checkIfDraw();
        console.log(win);
        console.log(draw);
        // if win or draw don't allow anymore turns
        if (win.decision) {
            gamePlaying = false;
        } 
        if (draw) {
            gamePlaying = false;
        }
    }

    // function checkForWinner (player) {
    //     // loop through arrays for player X and O 
    //     const outcome = player.checkIfWin();
    //     console.log(outcome);
    //     // if win don't allow anymore turns
    //     if (outcome.decision) {
    //         gamePlaying = false;
    //     }
    // }

    // function checkForDraw (player) {
    //     if (player.checkIfDraw) {
    //         gamePlaying = false;
    //     }
    // }

    function assignPlayer (e) {
        e.preventDefault();
        gamePlaying = true;
        if (gamePlaying) {
            const playerXName = document.querySelector('#player-x-name').value;
            const playerOName = document.querySelector('#player-o-name').value;
            playerX = gameBoard.addPlayer(playerXName, 'X');
            playerO = gameBoard.addPlayer(playerOName, 'O');
        }
    }

    return {
        init: function () {
            gamePlaying = false;
            clickCount = 0;
            setupEventListeners();
        }
    }
})(gameBoard, UIController);

gameController.init();