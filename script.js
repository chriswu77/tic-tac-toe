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
    const images = {
        cross: '<img src="images/cross.png">',
        circle: '<img src="images/circle.png">'
    };

    // use this module to control the display 
    const cellDOMs = Array.from(document.querySelectorAll('.box'));
    const playerOneDot = document.querySelector('.player-one-dot');
    const playerTwoDot = document.querySelector('.player-two-dot');
    const playerOneName = document.getElementById('player-1-name');
    const playerTwoName = document.getElementById('player-2-name');
    const drawText = document.getElementById('draw-text');
    const winnerOne = document.getElementById('winner-1');
    const winnerTwo = document.getElementById('winner-2');
    const modal = document.querySelector('.modal');
    const displayNames = Array.from(document.querySelectorAll('.player-text, .player-name'));
    const modalContent = document.querySelector('.modal-content');

    // const setLetterStyle = function (letter, cell) {
    //     if (letter === 'X') {
    //         cell.classList.add('player-1-color');
    //     } else if (letter === 'O') {
    //         cell.classList.add('player-2-color');
    //     }
    // };

    // public functions
    const renderMove = board => {
        for (let i = 0; i < cellDOMs.length; i++) {
            if (board[i] === 'X') {
                cellDOMs[i].innerHTML = images.cross;
            } else if (board[i] === 'O') {
                cellDOMs[i].innerHTML = images.circle;
            }
        }
    };

    const setPlayerNames = (player1, player2) => {
        playerOneName.textContent = player1.name;
        playerTwoName.textContent = player2.name;
        firstPlayerDot();
    };

    const firstPlayerDot = () => {
        playerOneDot.style.visibility = 'visible';
        playerTwoDot.style.visibility = 'hidden';
    };

    const toggleDot = letter => {
        if (letter === 'X') {
            playerTwoDot.style.visibility = 'visible';
            playerOneDot.style.visibility = 'hidden';
        } else {
            playerOneDot.style.visibility = 'visible';
            playerTwoDot.style.visibility = 'hidden';
        }
    };

    const highlightWin = (winningCombo, letter) => {
        letter = letter.toLowerCase();
        winningCombo.forEach(index => {
            document.getElementById(`box${index}`).classList.add(`highlight-${letter}`);
        });
    };

    const clearBoard = () => {
        cellDOMs.forEach(cell => {
            // cell.textContent = '';
            cell.innerHTML = '';
            cell.classList.remove('highlight-x');
            cell.classList.remove('highlight-o');
            cell.classList.remove('player-1-color');
            cell.classList.remove('player-2-color');
        });
    };

    const showDraw = () => {
        drawText.textContent = 'DRAW';
        playerOneDot.style.visibility = 'hidden';
        playerTwoDot.style.visibility = 'hidden';
    }

    const hideDraw = () => {
        drawText.textContent = '';
    };

    const setWinner = letter => {
        if (letter === 'X') {
            winnerOne.textContent = 'WINNER!';
        } else {
            winnerTwo.textContent = 'WINNER!';
        }
    };

    const resetPlayers = () => {
        winnerOne.textContent = 'Player 1';
        winnerTwo.textContent = 'Player 2';
        firstPlayerDot();
    };

    const hideModal = () => {
        modal.style.visibility = 'hidden';
    };

    const showNames = () => {
        console.log(displayNames);
        displayNames.forEach(cur => cur.style.visibility = 'visible');
    }

    const showPlayerForm = () => {
        const formHTML = "<form id='player-form'><p id='enter-text'>Enter Player Names</p><div id='player-x'><label>Player X</label><input id='player-x-name' type='text' required></div><div id='player-o'><label>Player O</label><input id='player-o-name' type='text' required></div><div class='player-buttons'><button type='button' id='back-btn-1'>Back</button><input type='submit' id='submit-btn-2' value='Submit'></div></form>";
        modalContent.innerHTML = formHTML;
    };

    return {
        renderMove,
        setPlayerNames,
        firstPlayerDot,
        toggleDot,
        highlightWin,
        clearBoard,
        showDraw,
        hideDraw,
        setWinner,
        resetPlayers,
        hideModal,
        showNames,
        showPlayerForm
    }
})();

const gameController = (function () {
    // use this module to control the flow of the game, Global app controller
    let gamePlaying;
    let clickCount;
    let mode;
    let playerX;
    let playerO;

    const setupEventListeners = () => {
        document.addEventListener('click', clickCell);
        // document.querySelector('#player-form').addEventListener('submit', assignPlayer);
        document.getElementById('restart-btn').addEventListener('click', restart);
        Array.from(document.querySelectorAll('#vs-player-btn, #vs-computer-btn')).forEach(cur => cur.addEventListener('click', selectMode));
    };

    const selectMode = e => {
        const btn = e.target.id;
        if (btn === 'vs-player-btn') {
            mode = 'player';
        } else if (btn === 'vs-computer-btn') {
            mode = 'computer';
        }
        UIController.showPlayerForm();
        // console.log(mode);
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
        UIController.resetPlayers();
        // UIController.firstPlayerDot();
        UIController.hideDraw();
    };

    const pushData = (player, cellIndex) => {
        gameBoard.insertInBoard(player.letter, cellIndex);
        gameBoard.insertInData(player, cellIndex);
        // render the board to the UI
        UIController.renderMove(gameBoard.getBoard());
        // UIController.toggleDot(player.letter);
    };      

    const gameOver = player => {
        const win = player.checkIfWin();
        const draw = player.checkIfDraw();
        console.log(win);
        console.log(draw);
        // if win or draw don't allow anymore turns
        if (win.decision) {
            gamePlaying = false;
            // set winner name and keep dot on winner
            UIController.setWinner(player.letter);
            // highlight board UI for winning combo
            UIController.highlightWin(win.winningIndex, player.letter);
        } else if (draw) {
            gamePlaying = false;
            UIController.showDraw();
        } else {
            UIController.toggleDot(player.letter);
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
            document.querySelector('#player-form').reset();
            UIController.hideModal();
            UIController.showNames();
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