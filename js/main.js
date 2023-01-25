/*----- constants -----*/
const BOARD_ROWS = 16;
const BOARD_COLS = 16;
let MINE_COUNT = 40;

/*----- app's state (variables) -----*/
let board;
let win;



/*----- cached element references -----*/
let boardEl = document.getElementById('board');
let squareEl = document.querySelector(`board > div`)

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

    render() {
        // if(this.isMine = true) {
        //     document.getElementById(`r${this.rowIdx}c${this.colIdx}`).style.backgroundColor = 'black';
        // }
        console.log("square rendered!") ; 
    }
    
}

// new MinesweeperGame {
//     constructor() {}
// }



/*----- event listeners -----*/
boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('contextmenu', handleRightClick);


/*----- functions -----*/
init();
console.log(board);
function init() {
    board = [];
    for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
        board[rowIdx] = [];
        for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
            board[rowIdx].push(new Square(rowIdx, colIdx))
        };
}
    generateBombs ();
    // board.forEach(function(rowIdx, colIdx){
    //     getAdjSquares(rowIdx, colIdx);

    // });
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(square, colIdx) {
            calcAdjMines(rowIdx,colIdx);
        });
    });
    render ();
}

function handleClick(evt) {
    let idSplit = evt.target.id.split(" ");
    let rowIdx = idSplit[0].replace("r", "");
    let colIdx = idSplit[1].replace("c", "");
    if (board[rowIdx][colIdx].isFlagged === true) return;
    if (board[rowIdx][colIdx].isMine === true) {
        // lose();
        // console.log('boom');
    };
    if (board[rowIdx][colIdx].isMine === false) {
        // reveal();
        // console.log('safe');
    };
}
function handleRightClick(evt) {
    let idSplit = evt.target.id.split(" ");
    let rowIdx = idSplit[0].replace("r", "");
    let colIdx = idSplit[1].replace("c", "");
    let flagShow = document.getElementById(`r${rowIdx} c${colIdx}`);
    if (board[rowIdx][colIdx].isFlagged === false) {
        board[rowIdx][colIdx].isFlagged = true;
        flagShow.style.backgroundColor = 'red';
    } else {
        board[rowIdx][colIdx].isFlagged = false;
        flagShow.style.backgroundColor = 'white';
    };
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

function calcAdjMines (rowIdx, colIdx) {
    const homeSquare = board[rowIdx][colIdx];
    const adjSquares = getAdjSquares(rowIdx,colIdx);
    adjSquares.forEach(function(adjSquare) {
        if (adjSquare.isMine === true) {
            homeSquare.adjMineCount = homeSquare.adjMineCount + 1;
        };
    });
    if (homeSquare.adjMineCount > 0) {
        document.getElementById(`r${rowIdx} c${colIdx}`).innerHTML = `${homeSquare.adjMineCount}`;
    }
    return adjSquares;
}

function generateBombs () {
   while (MINE_COUNT > 0) {
       let rndRow = Math.floor(Math.random() * BOARD_ROWS);
       let rndCol = Math.floor(Math.random() * BOARD_COLS);
    //    console.log(rndRow,rndCol);
       if (board[rndRow][rndCol].isMine === false) {
           board[rndRow][rndCol].isMine = true;
           MINE_COUNT--;
           document.getElementById(`r${rndRow} c${rndCol}`).style.backgroundColor = 'black';
       }
   };
}

function render () {
    board.forEach(function(rowArr) {
        rowArr.forEach(function(square) {
            square.render();
        });
    });
}