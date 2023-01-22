/*----- constants -----*/


/*----- app's state (variables) -----*/
let board;
let win;


/*----- cached element references -----*/


/*----- classes -----*/
class Pedal {
    constructor() {}

   //is distortion?
    //if no:
        //if adj === 0 reveal & flood
        //if adj
}

/*----- event listeners -----*/


/*----- functions -----*/
init();

function init() {
    board = []; //randomize distortion-pedal placement, calculate adjacent square #'s, identify 'empty' squares
    win = nill;
    render();
}

function render() {
    renderBoard(); //iterate through squares
    renderFlagCount();
    renderTimer();

}

function renderBoard() {}
function renderFlagCount() {}
function renderTimer() {}

// board   
//     is mine?
//     is flagged ? false

