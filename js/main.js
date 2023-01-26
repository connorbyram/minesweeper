/*----- constants -----*/
const BOARD_ROWS = 16;
const BOARD_COLS = 16;
let MINE_COUNT = 40;
const flag = 'assets/images/flag.png'
const bomb = 'assets/images/bomb.png'

/*----- app's state (variables) -----*/
let board;
let win;
let loss;
let flagCount = MINE_COUNT;
let totalSeconds = 0;




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

function lose() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (square, colIdx) {
            square.isFlagged = false;
            square.isRevealed = true;
        });
    });
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
        if (adjSquare.isMine === true) {
            square.adjMineCount = square.adjMineCount + 1;
        };
    });
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

function generateBombs() {
    let mineCount = MINE_COUNT;
    while (mineCount > 0) {
        let rndRow = Math.floor(Math.random() * BOARD_ROWS);
        let rndCol = Math.floor(Math.random() * BOARD_COLS);
        if (!board[rndRow][rndCol].isMine) {
            board[rndRow][rndCol].isMine = true;
            mineCount--;
        }
    };
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
    } else {
      return valString;
    }
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
            };
            if (square.isFlagged) {
                squareDiv.style.backgroundImage = `url(${flag})`;
                squareDiv.style.color = "rgba(0, 0, 0, 0)";
            } else {
                squareDiv.style.backgroundImage = "none";
                if (!square.isRevealed) {
                    squareDiv.style.backgroundColor = "green";
                    squareDiv.style.color = "rgba(0, 0, 0, 0)"
                } else {
                    squareDiv.style.backgroundColor = "grey";
                    if (square.isMine) {
                        squareDiv.style.backgroundImage = `url(${bomb})`;
                    };
                    squareDiv.style.color = "rgba(0, 0, 0, 1)";
                    squareDiv.innerHTML = `${square.adjMineCount}`;
                    if (square.adjMineCount === 0) {
                        squareDiv.style.backgroundColor = 'white';
                        squareDiv.innerHTML = ``;
                    };
                }
            };
        });
    })
}