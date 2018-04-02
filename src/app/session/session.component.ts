import { Component, OnInit } from '@angular/core';
import { TicTacToeBoard } from '../tic-tac-toe-board';
import { Session } from './session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  session: Session = Object.assign(new Session(), JSON.parse(localStorage.getItem('session'))) || new Session();
  sessionComp: SessionComponent = this;

  constructor() { }

  ngOnInit() {
    console.log('local storage: ' + localStorage.getItem('session'));
  }

  turnTaken(board: TicTacToeBoard) {
    this.session.update(board);
    localStorage.setItem('session', JSON.stringify(this.session));
    console.log('session: ' + JSON.stringify(this.session));
  }

  newSession() {
    this.session = new Session();
    localStorage.setItem('session', JSON.stringify(this.session));
  }
}
