// Connect Four Game (Complete)
// Rules:
//  1. X goes first, O goes second.
//  2. Default grid size is 6 rows by 7 columns.
//  3. Must get 4 X's or O's in a row (either by row, by column, or diagonally) to win.
//  4. Players must enter in valid column numbers, i.e. numbers 0 through 6 for the base game (column numbers are 0-indexed),
//     or else the program will continue to prompt the user.
//  5. Enter 'q' to quit the game.


// Original Prompt:
// Build Connect 4
// 1. Create a board class with
// a) a method to drop a token at a column
// b) a method to print the board.

// The board should look like the following (including column numbers):
// -|-|-|-
// -|-|-|X
// -|O|-|O
// -|X|-|X
// 1 2 3 4

const readlineSync = require('readline-sync')

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cellArray = new Array(height).fill('-').map(x => new Array(width).fill('-'));
    this.xPlaysNext = true;
    this.win = false;
  }

  dropToken(colNum) {
    if (this.cellArray[0][colNum] != '-') {
      return console.log('Column is full')
    }

    const token = this.xPlaysNext ? 'X' : 'O'
    console.log(`Dropping token for ${token}`)
    for (let rowNum = this.cellArray.length-1; rowNum >= 0; rowNum--) {
      if (this.cellArray[rowNum][colNum] === '-') {
        this.cellArray[rowNum][colNum] = token
        this.xPlaysNext = !this.xPlaysNext
        this.win = this.checkForWinner(rowNum,colNum,token)
        if (this.win) {
          return console.log(`Player ${token} wins!`)
        }
        break;
      }
    }

  }

  printBoard() {
    // console.log(this.cellArray)
    this.cellArray.forEach(row => console.log(row.join(' | ')))
    console.log()
  }

  checkLines(rowNum, colNum, lineName, token) {
    let inARow = 0;
    let val = token;
    let line;
    if (lineName === 'row') {
      line = this.cellArray[rowNum];
      // console.log(`row check: ${line}`)
    } else if (lineName === 'col') {
      line = this.cellArray.map(row => row[colNum]);
      // console.log(`col check: ${line}`)
    } else if (lineName === 'rightDiag') {
      line = this.getDiagLine(rowNum, colNum, 'right');
      // console.log(`right diag check: ${line}`)
    } else {
      line = this.getDiagLine(rowNum, colNum, 'left');
      // console.log(`left diag check: ${line}`)
    }
    const indexes = line.reduce((a,e,i) => {
      if (e === token) {
        a.push(i);
      }
      return a;
    }, [])

    // Return false if there aren't 4 tokens present
    if (indexes.length < 4) {
      return false;
    }

    const diff = []
    for (let i=0; i<indexes.length-1; i++) {
      diff.push(indexes[i+1]-indexes[i])
    }

    if (diff.every(x => x === 1)) {
      return true;
    } else {
      return false;
    }
  }

  getDiagLine(rowNum, colNum, direction) {
    let corner;
    let incRow;
    let incCol;
    if (direction === 'right') {
      corner = 'bottomLeft';
      incRow = -1;
      incCol = 1;
    } else {
      // left
      corner = 'bottomRight';
      incRow = -1;
      incCol = -1;
    }

    const coord = this.findDiagLimit(rowNum, colNum, corner);
    // console.log(`${corner} coord: [${coord[0]},${coord[1]}]`)

    let line = []
    let rowToTry = coord[0];
    let colToTry = coord[1];

    while(this.isValidCoord(rowToTry,colToTry)) {
      line.push(this.cellArray[rowToTry][colToTry]);
      rowToTry += incRow;
      colToTry += incCol;
    }
    return line;
  }

  findDiagLimit(rowNum, colNum, corner) {
    let incRow;
    let incCol;
    if (corner === 'bottomLeft') {
      incRow = 1;
      incCol = -1;
    } else {
      // bottomRight
      incRow = 1;
      incCol = 1;
    }

    let rowBottomLeft = rowNum;
    let colBottonLeft = colNum;

    let rowToTry = rowNum;
    let colToTry = colNum;
    while(this.isValidCoord(rowToTry, colToTry)) {
      rowBottomLeft = rowToTry;
      colBottonLeft = colToTry;
      rowToTry += incRow;
      colToTry += incCol;
    }
    
    return [rowBottomLeft, colBottonLeft];

  }

  isValidCoord(rowNum,colNum) {
    if (rowNum >= 0 && rowNum < this.cellArray.length) {
      if (colNum >= 0 && colNum < this.cellArray[0].length) {
        return true;
      }
    }
    return false;
  }

  checkForWinner(rowNum, colNum, token) {

    let fourInARow = new Array(4).fill(false)

    // Check row win
    fourInARow[0] = this.checkLines(rowNum, colNum, 'row', token)

    // Check col win
    fourInARow[1] = this.checkLines(rowNum, colNum, 'col', token)

    // Check right diagonal win
    fourInARow[2] = this.checkLines(rowNum, colNum, 'rightDiag', token)

    // Check left diagonal win
    fourInARow[3] = this.checkLines(rowNum, colNum, 'leftDiag', token)


    if (fourInARow.includes(true)) {
      return true;
    } else {
      return false;
    }
  }

}

function playConnectFour() {

  // Instantiate board
  board = new Board(7,6);

  board.printBoard();

  while (!board.win) {

    const token = board.xPlaysNext ? 'X' : 'O';
    const userInput = readlineSync.question(`Player ${token}, pick a column: `);
    
    // If 'q', then break out of while loop
    if (userInput === 'q') {
      console.log('\nQuitting game...')
      break;
    }

    // Convert user input to integer
    const colNum = parseInt(userInput);

    // Check that user input is a valid integer
    if (Number.isInteger(colNum) && colNum>=0 && colNum<=board.cellArray[0].length-1) {
      board.dropToken(colNum);
    }
    board.printBoard();
  }

  console.log('\nGame is over!\n');
}

playConnectFour();