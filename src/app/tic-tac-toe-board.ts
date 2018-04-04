import { Move } from "./tic-tac-toe/move";

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
    for (let x = 0; x < this.cells.length; x++) {
      for (let y = 0; y < this.cells[x].length; y++) {
        this.possibleMoves.push(new Move(x, y, 'O'));
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

    takeTurn(move: Move) {
      const x = move.x;
      const y = move.y;
      console.log(`${x} , ${y}`);
      if (this.cells[x][y] === '-' && !this.winner) {
        this.cells[x][y] = this.whoseTurn;
        if (this.turnsTaken >= 4) { this.checkWinner(x, y); }
        this.logMove(move);
        this.switchTurn();
        this.turnsTaken++;
        this.removeAIMove(move);
        return true;
      } else {
        new Audio('assets/sounds/Basso.mp3').play();
        return false;
      }
    }

    removeAIMove(move: Move) {
      const removed = new Move(move.x, move.y, 'O');
      console.log(removed);
      console.log("^^^^removed^^^^");
      this.possibleMoves = this.possibleMoves.filter(eachMove => JSON.stringify(eachMove) !== JSON.stringify(removed));

      //   function(eachMove) {
      //   console.log(eachMove);
      //   console.log(`equal? ${JSON.stringify(removed) === JSON.stringify(eachMove)}`);
      // });
      console.log(this.possibleMoves);
    }

    switchTurn() {
      this.whoseTurn = this.whoseTurn === 'X' ? 'O' : 'X';
    }

    checkWinner(x, y) {
      this.winner = this.checkColumn(y) || this.checkRow(x);
      if ((x + y) % 2 === 0 && !this.winner) {
        if (x === y) {
          this.winner = this.checkDownDiag();
        } else if (x + y === 2) {
          this.winner = this.checkUpDiag();
        }
      }
      if (this.winner) {
        this.winningPlayer = this.whoseTurn;
      }
      return this.winner;
    }

    logMove(move: Move) {
      this.moveLog.push(move);
    }

    undo() {
      const move = this.moveLog.pop();
      this.cells[move.x][move.y] = '-';
      this.whoseTurn = move.player === 'X' ? 'X' : 'O';
      this.turnsTaken--;
      return move;
    }

    checkDownDiag() {
      return this.cells[0][0] === this.cells[1][1] && this.cells [1][1] === this.cells[2][2];
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
}
