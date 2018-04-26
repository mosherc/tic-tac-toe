import { TicTacToeBoard } from "../tic-tac-toe/tic-tac-toe-board";
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
    public maxFreq = 0,
    public avgSpace = { 'x': 0, 'y': -10000 },
    public difficulty = 'random'
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

  /* Called each time a turn is taken, this updates all the
  session data based on the existing board and move played */
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

  /* Undoes all session statistics when a move is undone */
  undoStats() {
    this.totalTurns--;
    if (this.board.turnsTaken < 1) {
        this.gamesPlayed--;
    }
    this.movesUndone++;
    this.allMoves.pop();
  }

  /* Calculates the average played space over a session */
  averageSpace() {
    let x = this.allMoves.map(move => move.x).reduce((move, total) => move + total) / this.totalTurns;
    let y = this.allMoves.map(move => move.y).reduce((move, total) => move + total) / this.totalTurns;
    this.avgSpace = { 'x': x, 'y': y };
  }

  /* Calculates the most popular space (mode), does so by
  flattening frequency matrix, sorting a copy of it,  */
  mostPopularSpace() {
    const flat = [].concat(...this.moveFreq);
    const flatSort = [...flat].sort((a, b) => a - b);
    this.minFreq = flatSort[0];
    this.maxFreq = flatSort[8];
    const index = flat.indexOf(flatSort[8]);
  }

  /*  Stats TODO:
      moves per game
      streaks 
  */

  newGame() {
    this.board = new TicTacToeBoard();
  }
}
