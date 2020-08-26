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
            },
            clearTurns: function () {
                this.turns = [];
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

    // public functions 
    const addPlayer = (name, letter) => {
        const player = Player(name, letter);
        return player
    };

    const insertInBoard = (letter, index) => {
        board[index] = letter;
        console.log(board);
    };

    const insertInData = (player, index) => {
        player.pushTurn(index);
        console.log(player);
        console.log(player.turns);
    };

    const checkIfEmpty = index => {
        if (board[index] !== 'X' && board[index] !== 'O') {
            return true;
        } else {
            return false;
        }
    };

    const getBoard = () => {
        return board;
    };

    const clearBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return {
        addPlayer,
        insertInBoard,
        insertInData,
        checkIfEmpty,
        getBoard,
        clearBoard
    }
})();

const UIController = (function () {
    // use this module to control the display 
    const cellDOMs = Array.from(document.querySelectorAll('.box'));
    const playerOneBubble = document.querySelector('#player-1-bubble');
    const playerTwoBubble = document.querySelector('#player-2-bubble');
    const playerOneName = document.getElementById('player-1-name');
    const playerTwoName = document.getElementById('player-2-name');

    const setLetterStyle = function (letter, cell) {
        if (letter === 'X') {
            cell.classList.add('player-1-color');
        } else if (letter === 'O') {
            cell.classList.add('player-2-color');
        }
    };

    // public functions
    const renderMove = board => {
        for (let i = 0; i < cellDOMs.length; i++) {
            cellDOMs[i].textContent = board[i];
            setLetterStyle(board[i], cellDOMs[i]);
        }
    };

    const setPlayerNames = (player1, player2) => {
        playerOneName.textContent = player1.name;
        playerTwoName.textContent = player2.name;
        firstPlayerBubble();
    };

    const firstPlayerBubble = () => {
        playerOneBubble.style.visibility = 'visible';
        playerTwoBubble.style.visibility = 'hidden';
    };

    // const resetLetterStyle = () => {
    //     cellDOMs.forEach(cell => {
    //         cell.classList.remove('player-1-color');
    //         cell.classList.remove('player-2-color');
    //     });
    // };

    const toggleBubble = letter => {
        if (letter === 'X') {
            playerTwoBubble.style.visibility = 'visible';
            playerOneBubble.style.visibility = 'hidden';

        } else {
            playerOneBubble.style.visibility = 'visible';
            playerTwoBubble.style.visibility = 'hidden';
        }
    };

    // const hideBubble = () => {
    //     playerOneBubble.style.visibility = 'hidden';
    //     playerTwoBubble.style.visibility = 'hidden';
    // };

    const highlightWin = winningCombo => {
        winningCombo.forEach(index => {
            document.getElementById(`box${index}`).classList.add('highlight');
        });
    };

    const clearBoard = () => {
        cellDOMs.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('highlight');
            cell.classList.remove('player-1-color');
            cell.classList.remove('player-2-color');
        });
    };

    return {
        renderMove,
        setPlayerNames,
        firstPlayerBubble,
        // resetLetterStyle,
        toggleBubble,
        // hideBubble,
        highlightWin,
        clearBoard
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
    };

    const restart = () => {
        // clear the game board
        gameBoard.clearBoard();
        // clear the player turns
        playerX.clearTurns();
        playerO.clearTurns();
        // reset click count
        clickCount = 0;
        // set game state
        gamePlaying = true;
        // reset the UI
        UIController.clearBoard();
        // UIController.hideBubble();

        UIController.firstPlayerBubble();
        // UIController.resetLetterStyle();
    };

    const pushData = (player, cellIndex) => {
        gameBoard.insertInBoard(player.letter, cellIndex);
        gameBoard.insertInData(player, cellIndex);
        // render the board to the UI
        UIController.renderMove(gameBoard.getBoard());
        UIController.toggleBubble(player.letter);
    };      

    const gameOver = player => {
        // loop through array for player X or O 
        const win = player.checkIfWin();
        const draw = player.checkIfDraw();

        console.log(win);
        console.log(draw);
        // if win or draw don't allow anymore turns
        if (win.decision) {
            gamePlaying = false;
            // highlight board UI for winning combo
            UIController.highlightWin(win.winningIndex);
        } 
        if (draw) {
            gamePlaying = false;
        }
    };

    const clickCell = e => {
        if (gamePlaying) {
            if (e.target.closest('#board')) {
                const cellIndex = parseInt(e.target.id.substr(-1,1));
                if (cellIndex >= 0 && cellIndex <= 8) {
                    const isEmpty = gameBoard.checkIfEmpty(cellIndex);
                    if (isEmpty) {
                        let player;
                        clickCount++;
                        console.log(cellIndex);
                        console.log(clickCount);
                        if (clickCount % 2 === 1) {
                            // Player X's turn
                            player = playerX;
                        } else if (clickCount % 2 === 0) {
                            // Player O's turn
                            player = playerO;
                        }
                        pushData(player, cellIndex);
                        gameOver(player);
                    }
                }
            }
        }
    };

    const assignPlayer = e => {
        e.preventDefault();
        gamePlaying = true;
        if (gamePlaying) {
            const playerXName = document.querySelector('#player-x-name').value;
            const playerOName = document.querySelector('#player-o-name').value;
            playerX = gameBoard.addPlayer(playerXName, 'X');
            playerO = gameBoard.addPlayer(playerOName, 'O');
            UIController.setPlayerNames(playerX, playerO);
        }
    };

    return {
        init: function () {
            gamePlaying = false;
            clickCount = 0;
            setupEventListeners();
        }
    }
})(gameBoard, UIController);

gameController.init();