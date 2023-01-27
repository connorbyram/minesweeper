/*----- constants -----*/
const BOARD_ROWS = 16;
const BOARD_COLS = 16;
let MINE_COUNT = 8;
;
const hidden = 'assets/images/empty.jpg'
const flag = 'assets/images/flag.jpg'
const bomb = 'assets/images/mine.jpg'
const jsConfetti = new JSConfetti();

/*----- app's state (variables) -----*/
let board;
let win;
let loss;
let flagCount = MINE_COUNT;
let totalSeconds;


/*----- cached element references -----*/
let boardEl = document.getElementById('board');
let squareEl = document.querySelector(`board > div`)
let resetEl = document.querySelector('button')
let flgCountEl = document.getElementById('flag-count')
let minutesEl = document.getElementById("minutes");
let secondsEl = document.getElementById("seconds");

/*----- classes -----*/
class Square {
    constructor(rowIdx, colIdx) {
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjMineCount = 0;
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
    }   
    render() {}
}


/*----- event listeners -----*/
boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('click', startTimer, {once: true});
boardEl.addEventListener('contextmenu', handleRightClick);
resetEl.addEventListener('click', init);


/*----- functions -----*/
init();
function init() {
    board = [];
    flagCount = MINE_COUNT;
    win = false;
    loss = false;
    totalSeconds = 0;
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        board[rowIdx] = [];
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            board[rowIdx].push(new Square(rowIdx, colIdx))
        };
    }
    generateBombs();
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (square, colIdx) {
            calcAdjMines(square, rowIdx, colIdx);
        });
    });
    render();
}

function generateBombs() {
    let mineCount = MINE_COUNT;
    while (mineCount > 0) {
        let rndRow = Math.floor(Math.random() * BOARD_ROWS);
        let rndCol = Math.floor(Math.random() * BOARD_COLS);
        if (!board[rndRow][rndCol].isMine) {
            board[rndRow][rndCol].isMine = true;
            mineCount--;
        }
    }
}

function getAdjSquares(rowIdx, colIdx) {
    const adjSquares = [];
    for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
        for (let colOffset = -1; colOffset < 2; colOffset++) {
            const adjRow = rowIdx + rowOffset;
            const adjCol = colIdx + colOffset;
            if (!(adjRow === rowIdx && adjCol === colIdx) && adjRow >= 0 && adjRow < board.length && adjCol >= 0 && adjCol < board[0].length)
                adjSquares.push(board[adjRow][adjCol]);
        }
    };
    return adjSquares;
}

function calcAdjMines(square, rowIdx, colIdx) {
    square.adjSquares = getAdjSquares(rowIdx, colIdx);
    square.adjSquares.forEach(function (adjSquare) {
        if (adjSquare.isMine) {
            square.adjMineCount = square.adjMineCount + 1;
        };
    });
}

function handleClick(evt) {
    let idSplit = evt.target.id.split(" ");
    let rowIdx = idSplit[0].replace("r", "");
    let colIdx = idSplit[1].replace("c", "");
    let clickedSqr = board[rowIdx][colIdx];
    if (win === true || loss === true || clickedSqr.isFlagged) return;
    if (clickedSqr.isMine) {
        clickedSqr.isRevealed = true;
        loss = true;
    } else {
        clickedSqr.isRevealed = true;
        if (clickedSqr.adjMineCount === 0) {
            flood(clickedSqr);
        }
    };
    render();
}

function handleRightClick(evt) {
    let idSplit = evt.target.id.split(" ");
    let rowIdx = idSplit[0].replace("r", "");
    let colIdx = idSplit[1].replace("c", "");
    if (win === true || loss === true || board[rowIdx][colIdx].isRevealed) return;
    if (!board[rowIdx][colIdx].isFlagged) {
        board[rowIdx][colIdx].isFlagged = true;
        flagCount--;
    } else {
        board[rowIdx][colIdx].isFlagged = false;
        flagCount++;
    };
    render();
}

function startTimer() {
    setInterval(setTime, 1000);
    const audio = document.getElementById('fugue');
    audio.play();
}

function setTime() {
    if (win === true || loss === true ) return;
    ++totalSeconds;
    secondsEl.innerHTML = pad(totalSeconds % 60);
    minutesEl.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else return valString;
    
}

function flood(clickedSqr) {
    console.log(clickedSqr.adjSquares);
    clickedSqr.isRevealed = true;
    clickedSqr.isFlagged = false;
    if (clickedSqr.adjMineCount === 0) {
        clickedSqr.adjSquares.forEach(function (adjSquare) {
            if (!adjSquare.isMine && !adjSquare.isRevealed) flood(adjSquare); 
        });   
    }
}

function checkWin () {
    let hiddenCount = 0;
    board.forEach(function (rowArr, rowIdx) {
            rowArr.forEach(function (square, colIdx){
                if (!square.isRevealed) {
                    hiddenCount = hiddenCount + 1
                }
            });
        });
    if (hiddenCount === MINE_COUNT) win = true; 
}

function confettiWin() {
    jsConfetti.addConfetti({
        confettiColors: [
            '#E4170A', 
            '#439194', 
            '#004AAD', 
            '#7ED957', 
            '#FFDE59', 
            '#FF914D',
          ],
        confettiRadius: 8,
        confettiNumber: 20,
    })
}

function lose() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (square, colIdx) {
            square.isFlagged = false;
            square.isRevealed = true;
        })
    })
}

function render() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (square, colIdx) {
            flgCountEl.innerHTML = `${flagCount}`;
            let squareDiv = document.getElementById(`r${rowIdx} c${colIdx}`);
            if (loss === true) lose();
            checkWin();
            if (win === true) {
                if (square.isMine) square.isFlagged = true;
                confettiWin();
            };
            if (square.isFlagged) {
                squareDiv.style.backgroundImage = `url(${flag})`;
                squareDiv.style.color = 'rgba(0, 0, 0, 0)';
            } else {
                squareDiv.style.backgroundImage = 'none';
                if (!square.isRevealed) {
                    squareDiv.style.backgroundImage = `url(${hidden})`;
                    squareDiv.style.color = 'rgba(0, 0, 0, 0)';
                    squareDiv.style.borderLeft = '0.2vmin solid #D9D9D9';
                    squareDiv.style.borderTop = '0.2vmin solid #D9D9D9';
                    squareDiv.style.borderRight = '0.2vmin solid black';
                    squareDiv.style.borderBottom = '0.2vmin solid black';
                } else {
                    squareDiv.style.backgroundColor = '#A6A6A6';
                    squareDiv.style.border = '0.02px solid #545454';
                    if (square.isMine) {
                        squareDiv.style.backgroundImage = `url(${bomb})`;
                    };
                    squareDiv.style.color = 'rgba(0, 0, 0, 1)';
                    squareDiv.innerHTML = `${square.adjMineCount}`;
                    if (square.adjMineCount === 0 || square.isMine) {
                        squareDiv.style.backgroundColor = '#D9D9D9';
                        squareDiv.innerHTML = ``;
                    };
                }
            };
        });
    })
}