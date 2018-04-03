import { TicTacToeBoard } from "../tic-tac-toe-board";
import { Move } from "../tic-tac-toe/move";

export class Session {

  constructor(
    public board = new TicTacToeBoard(),
    public gamesPlayed = 0,
    public wins = 0,
    public computerWins = 0,
    public totalTurns = 0,
    public movesUndone = 0,
    public allMoves: Move[] = [],
    public moveFreq = [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    public minFreq = 0,
    public maxFreq = 0
  ) {}

  getBoard() {
      return this.board;
  }

  getGamesPlayed() {
      return this.gamesPlayed;
  }

  getWins() {
      return this.wins;
  }

  getComputerWins() {
      return this.computerWins;
  }

  getTotalTurns() {
      return this.totalTurns;
  }

  update(board: TicTacToeBoard, move: Move) {
    this.board = board;
    this.totalTurns++;
    this.allMoves.push(move);
    this.moveFreq[move.x][move.y]++;
    if (board.turnsTaken === 1) {
        this.gamesPlayed++;
    }
    if (board.winningPlayer === 'X') {
        this.wins++;
    }
  }

  undoStats() {
    this.totalTurns--;
    if (this.board.turnsTaken < 1) {
        this.gamesPlayed--;
    }
    this.movesUndone++;
    this.allMoves.pop();
  }

  averageSpace() {
    let x = this.allMoves.map(move => move.x).reduce((move, total) => move + total);
    x /= this.totalTurns;
    let y = this.allMoves.map(move => move.y).reduce((move, total) => move + total);
    y /= this.totalTurns;
    // console.log('average move: ' + x + ', ' + y);
  }

  mostPopularSpace() {
    const flat = [].concat(...this.moveFreq);
    const flatSort = [...flat].sort((a, b) => a - b);
    this.minFreq = flatSort[0];
    this.maxFreq = flatSort[8];
    const index = flat.indexOf(flatSort[8]);

    console.log('most common move: ' + JSON.stringify(this.parseFlatIndex(index)));
  }

  parseFlatIndex(index) {
    return { x: Math.floor(index / 3), y: index % 3 };
  }

  // moves per game
  // streaks

  newGame() {
    this.board = new TicTacToeBoard();
    console.log(this.board);
  }

  //Session.observe(this.board, changes => console.log(changes));

}
