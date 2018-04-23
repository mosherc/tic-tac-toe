import { Component, OnInit } from '@angular/core';
import { TicTacToeBoard } from '../tic-tac-toe-board';
import { Session } from './session';
import { Move } from '../tic-tac-toe/move';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  session: Session = Object.assign(new Session(), JSON.parse(localStorage.getItem('session'))) || new Session();
  sessionComp: SessionComponent = this;

  constructor() { }

  ngOnInit() {}

  turnTaken(boardMoveObj) {
    this.session.update(boardMoveObj.board, boardMoveObj.move);
    localStorage.setItem('session', JSON.stringify(this.session));
    this.session.averageSpace();
    this.session.mostPopularSpace();
  }

  newSession() {
    this.session = new Session();
    localStorage.setItem('session', JSON.stringify(this.session));
  }
}
