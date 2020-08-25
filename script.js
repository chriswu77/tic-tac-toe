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
        },

        getBoard: function () {
            return board;
        }

    }

})();

const UIController = (function () {
    // use this module to control the display 
    const cellDOMs = Array.from(document.querySelectorAll('.box'));
    const playerOneBubble = document.querySelector('#player-1-bubble');
    const playerTwoBubble = document.querySelector('#player-2-bubble');

    const setLetterStyle = function (letter, cell) {
        if (letter === 'X') {
            cell.classList.add('player-1-color');
        } else if (letter === 'O') {
            cell.classList.add('player-2-color');
        }
    };

    return {
        renderMove: function (board) {
            for (let i = 0; i < cellDOMs.length; i++) {
                cellDOMs[i].textContent = board[i];
                setLetterStyle(board[i], cellDOMs[i]);
            }
        },

        toggleBubble: function (letter) {
            if (letter === 'X') {
                playerOneBubble.style.visibility = 'visible';
                playerTwoBubble.style.visibility = 'hidden';
            } else {
                playerTwoBubble.style.visibility = 'visible';
                playerOneBubble.style.visibility = 'hidden';
            }
        }
    }

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
        document.getElementById('restart-btn').addEventListener('click', restart);
    }

    function restart() {
        
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
            // render the board to the UI
            UIController.renderMove(gameBoard.getBoard());
            UIController.toggleBubble(player.letter);
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