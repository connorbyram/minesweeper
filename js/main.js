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
        this.isMine = false; //TODO randomize
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjMineCount = null;
        this.rowIdx;
        this.colIdx;
    }

    // computeAdjMineCount() {
    //     let neighbors = []; // r+1 c+0, r+1 c+1, r+0 c+1, r-1 c+1, r-1 c+0, r-1 c-1, r+0 c-1, r+1 c-1
    //     // TODO: push each neighboring cell into neighbors
    //     let count = 0;
    //     // TODO: Loop through the cells in the neighbors & increment count if cell is a mine
    //     this.adjMineCount = count;
    // }

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
    //generate bombs
}
    render ();
    generateBombs ();
    // countAdjBombs (); 
}

function handleClick(evt) {
    let evtSplit = evt.target.id.split(" ");
    let rowIdx = evtSplit[0].replace("r", "");
    let colIdx = evtSplit[1].replace("c", "");
    if (board[rowIdx][colIdx].isFlagged === true) return;
    if (board[rowIdx][colIdx].isMine === true) {
        // lose();
        console.log('boom');
    };
    if (board[rowIdx][colIdx].isMine === false) {
        // reveal();
        console.log('safe');
    };
}

// for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++){
//     for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
//         function checkDiagonalMineNWSE(colIdx, rowIdx) {
//           const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1)
//           const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1)


// function countAdjBombs() {
    
//     (board[rowIdx + 1][colIdx + 1].isMine === true) {
//         board[rowIdx][colIdx].adjMineCount + 1;
//     };
// }

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