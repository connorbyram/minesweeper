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
let resetEl = document.querySelector('button')

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
resetEl.addEventListener('click', init);


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
    if (board[rowIdx][colIdx].isFlagged === true) return; // && isRevealed === true
    if (board[rowIdx][colIdx].isMine === true) {
        board[rowIdx][colIdx].isRevealed = true;
        // lose();
    };
    if (board[rowIdx][colIdx].isMine === false) {
        board[rowIdx][colIdx].isRevealed = true;
        // reveal();
    }; // if mine=false && adjMineCount = 0 => reveal(); flood();

    render();
}
function handleRightClick(evt) {
    let idSplit = evt.target.id.split(" ");
    let rowIdx = idSplit[0].replace("r", "");
    let colIdx = idSplit[1].replace("c", "");
    let flagShow = document.getElementById(`r${rowIdx} c${colIdx}`);
    if (board[rowIdx][colIdx].isRevealed === true) return;
    if (board[rowIdx][colIdx].isFlagged === false) {
        board[rowIdx][colIdx].isFlagged = true;
    } else {
        board[rowIdx][colIdx].isFlagged = false;
    };

    render();
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
       }
   };
}

function render () {
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(square, colIdx){
            let squareDiv = document.getElementById(`r${rowIdx} c${colIdx}`);
            if (square.isFlagged === true) {
                squareDiv.classList.add('flagged'); 
            } else if (square.isFlagged === false) {
                squareDiv.classList.remove('flagged');
                if (square.isRevealed === false) {
                    squareDiv.classList.add('covered');
                } else {
                    squareDiv.classList.remove('covered');
                    squareDiv.style.backgroundColor = 'red';
                    if (square.isMine === true) {
                        squareDiv.classList.add('bomb');
                    };
                    if (square.adjMineCount === 0) {
                        squareDiv.style.backgroundColor = 'yellow';
                    };
                }
            };
        });
    })
}