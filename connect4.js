/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(p_color, p_number)
  {
    this.color = p_color;
    this.number = p_number;
  }

}
class Game {
  
  constructor(p_p1, p_p2, p_height = 6, p_width = 7) {
    this.board = [];
    this.height = p_height;
    this.width = p_width;

    this.p1 = p_p1;
    this.p2 = p_p2;
    this.currPlayer = this.p1;

    this.makeBoard();
    this.makeHtmlBoard(); 

    this.gameOver = false;
  }

  makeBoard() {
    for (let y = 0; y <  this.height; y++) {
      this.board.push((new Array(this.width)).fill(undefined));
    }
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
    htmlBoard.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const topRow = document.createElement('tr');
    topRow.setAttribute('id', 'column-top');

    this.BoardClickHandler = this.handleBoardClick.bind(this);

    topRow.addEventListener('click', this.BoardClickHandler);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      topRow.append(headCell);
    }

    htmlBoard.append(topRow);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  handleBoardClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;      
    this.placeInTable(y, x);         
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

      // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }

  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    let isWin = cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

    if(isWin){
      for (let [y, x] of cells) {
        const spot = document.getElementById(`${y}-${x}`);
        spot.style.backgroundColor = 'gold';
      }
    };

    return isWin;
  }

  /** endGame: announce game end */
  endGame(msg) {
    const topRow = document.getElementById('column-top');   
    topRow.removeEventListener('click', this.BoardClickHandler);
    alert(msg);
  }

}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value, 1);
  let p2 = new Player(document.getElementById('p2-color').value, 2);
  new Game(p1, p2);
});