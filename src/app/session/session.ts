import { TicTacToeBoard } from "../tic-tac-toe-board";

export class Session {

  constructor(
    public board = new TicTacToeBoard(),
    public gamesPlayed = 0,
    public wins = 0,
    public computerWins = 0,
    public totalTurns = 0,
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

  newGame() {
    this.board = new TicTacToeBoard();
    console.log(this.board);
  }

  //Session.observe(this.board, changes => console.log(changes));

}
