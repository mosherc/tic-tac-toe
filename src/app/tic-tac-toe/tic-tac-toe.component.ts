import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicTacToeBoard } from '../tic-tac-toe-board';
import { SessionComponent } from '../session/session.component';
import { Move } from './move';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  board: TicTacToeBoard = new TicTacToeBoard();
  state = 'moves';
  starter = false;

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionComp: SessionComponent;

  constructor() { }

  ngOnInit() {
  }

  newGame() {
    this.board = new TicTacToeBoard();
    this.switchStarter();
  }

  undo() {
    const move = this.board.undo();
    this.sessionComp.session.undoStats();
  }

  setState(state) {
    this.state = state;
  }

  takeTurn(x, y) {
    const move = new Move(x, y, this.board.whoseTurn);
    // this.board.takeTurn(move);
    if (this.board.takeTurn(move)) {
      this.notify.emit({board: this.board, move: move});
    }
  }

  switchStarter() {
    if (!this.board.turnsTaken) {
      this.board.whoseTurn = this.starter ? 'O' : 'X';
    }
  }
}
