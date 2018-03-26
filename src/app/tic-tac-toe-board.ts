export class TicTacToeBoard {

  constructor(
    public cells = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]],
    public turnsTaken = 0,
    public whoseTurn = 'X',
    public winner = false;
    public winningPlayer = '';
  ) {}

    setTurn(player) {
      this.whoseTurn = player;
    }

    getTurn() {
      return whoseTurn;
    }

    getBoard() {
      return cells;
    }

    setCell(x, y, player) {
      this.cells[x][y] = player;
    }

    getCell(x, y) {
      return this.cells[x][y];
    }

    takeTurn(x, y) {
      console.log(`${x} , ${y}`);
      if(this.cells[x][y] === '-' && !this.winner){
        this.cells[x][y] = this.whoseTurn;
        if(this.turnsTaken >= 4) this.checkWinner(x, y);
        this.switchTurn();
        console.log(this.cells);
      }
    }

    switchTurn() {
      this.whoseTurn = this.whoseTurn === 'X' ? 'O' : 'X';
      this.turnsTaken++;
    }

    checkWinner(x, y) {
      this.winner = this.checkColumn(y) || this.checkRow(x);
      if((x+y) % 2 === 0 && !this.winner) {
        if(x === y) {
          this.winner = this.checkDownDiag();
        } else if(x + y === 2) {
          this.winner = this.checkUpDiag();
        }
      }
      if(this.winner) {
        this.winningPlayer = this.whoseTurn;
      }
      return this.winner;
    }

    checkColumn(x) {
      return this.cells.map(y => y[x]).every((val, i, arr) => val === arr[0]);
    }
    checkRow(y) {
      console.log(this.cells[y].every((val, i, arr) => val === arr[0]));
      return this.cells[y].every((val, i, arr) => val === arr[0]);
    }
    checkDownDiag() {
      return this.cells[0][0] === this.cells[1][1] && this.cells [1][1] === this.cells[2][2];
    }
    checkUpDiag() {
      return this.cells[0][2] === this.cells[1][1] && this.cells [1][1] === this.cells[2][0];
    }
}
