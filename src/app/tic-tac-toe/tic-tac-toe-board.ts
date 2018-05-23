import { Move } from "./move";

export class TicTacToeBoard {

  constructor(
    public cells = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']],
    public turnsTaken = 0,
    public whoseTurn = 'X',
    public winner = false,
    public winningPlayer = '',
    public moveLog = [],
    public possibleMoves: Move[] = []
  ) {
    // Initialize possibleMoves for AI for all 9 cells
    for (let x = 0; x < this.cells.length; x++) {
      for (let y = 0; y < this.cells[x].length; y++) {
        this.possibleMoves.push(new Move(x, y, '-'));
      }
    }
  }

  setTurn(player) {
    this.whoseTurn = player;
  }

  getTurn() {
    return this.whoseTurn;
  }

  setFirstTurn(player) {
    if (this.turnsTaken === 0) { this.setTurn(player); }
  }

  getBoard() {
    return this.cells;
  }

  setCell(x, y, player) {
    this.cells[x][y] = player;
  }

  getCell(x, y) {
    return this.cells[x][y];
  }

  /* The method called for each player move
  Move object argument contains coordinates and player
  Returns true/false if move is valid/invalid */
  takeTurn(move: Move) {
    const x = move.x;
    const y = move.y;
    console.log(`${x} , ${y}`);
    /* This checks if the move is valid, i.e. it hasn't already
    been played and the game is not over. If valid,
    it updates all other stats, move log, and AI move pool,
    also checking if there is a winner */
    if (this.cells[x][y] === '-' && !this.winner) {
      this.cells[x][y] = this.whoseTurn;
      this.turnsTaken++;
      /* Optimization to check winner only after 4 moves */
      if (this.turnsTaken > 4) {
        this.checkWinner(x, y);
      }
      this.logMove(move);
      this.switchTurn();
      this.removeAIMove(move);
      return true;
    } else {
      new Audio('assets/sounds/Basso.mp3').play();
      return false;
    }
  }

  removeAIMove(removed: Move) {
    this.possibleMoves = this.possibleMoves.filter(eachMove => eachMove.x != removed.x || eachMove.y != removed.y);
    console.log(this.possibleMoves);
  }

  switchTurn() {
    this.whoseTurn = this.whoseTurn === 'X' ? 'O' : 'X';
  }

  /* This function always checks rows and columns,
  but only for the move that was played. Also only 
  checks diagonals if applicable */
  checkWinner(x, y) {
    this.winner = this.checkColumn(y) || this.checkRow(x);
    if (!this.winner && (x + y) % 2 === 0) {
      if (x === y) {
        this.winner = this.checkDownDiag();
      } else if (x + y === 2) {
        this.winner = this.checkUpDiag();
      }
    }
    if (this.winner) {
      this.winningPlayer = this.whoseTurn;
    }
  }


  checkColumn(x) {
    return this.cells.map(y => y[x]).every((val, i, arr) => val === arr[0]);
  }

  checkRow(y) {
    return this.cells[y].every((val, i, arr) => val === arr[0]);
  }

  checkUpDiag() {
    return this.cells[0][2] === this.cells[1][1] && this.cells [1][1] === this.cells[2][0];
  }

  checkDownDiag() {
    return this.cells[0][0] === this.cells[1][1] && this.cells [1][1] === this.cells[2][2];
  }

  logMove(move: Move) {
    this.moveLog.push(move);
  }

  /* Undo removes a move from the log and resets associated data */
  undo() {
    const move = this.moveLog.pop();
    this.cells[move.x][move.y] = '-';
    this.whoseTurn = move.player === 'X' ? 'X' : 'O';
    this.turnsTaken--;
    return move;
  }
}
