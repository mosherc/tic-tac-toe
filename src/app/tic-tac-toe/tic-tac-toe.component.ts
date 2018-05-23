import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicTacToeBoard } from './tic-tac-toe-board';
import { SessionComponent } from '../session/session.component';
import { Move } from './move';
import { trigger, style, transition, animate, group, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss'],
  animations: [
    trigger('gameOver', [
      state('false', style({opacity: 0, 'margin-bottom': 0, height: 0})),
      transition('false => true', animate('500ms', keyframes([
        style({opacity: 0, height: 0, 'margin-bottom': 0, offset: 0}),
        style({opacity: .1, height: '*', 'margin-bottom': '*', offset: 0.5}),
        style({opacity: 1, offset: 1.0})
      ]))),
      transition('true => false', animate('500ms', keyframes([
        style({opacity: 1, height: '*', 'margin-bottom': '*', offset: 0}),
        style({opacity: .1, offset: 0.5}),
        style({opacity: 0, height: 0, 'margin-bottom': 0, offset: 1.0})
      ])))
    ]),
    trigger('newGamePulse', [
      state('false', style({transform: 'scale(1)'})),
      state('true', style({transform: 'scale(1.1)'})),
      transition('* => *', animate('500ms ease-in-out'))
    ]),
    /* This animation does not work well, consider removing */
    // trigger('played', [
    //   transition(':enter', [
    //     style({opacity: 0}),
    //     animate('500ms', style({opacity: 1}))
    //   ]),
    //   transition(':leave', [
    //     style({opacity: 1}),
    //     animate('500ms', style({opacity: 0}))
    //   ])
    // ]),
    trigger('moveLog', [
      transition(':enter', [
        style({opacity: 0, height: 0}),
        animate('500ms', keyframes([
          style({opacity: 0, height: 0, offset: 0}),
          style({opacity: .1, height: '*', offset: 0.5}),
          style({opacity: 1, offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class TicTacToeComponent implements OnInit {

  board: TicTacToeBoard = new TicTacToeBoard();
  state = 'moves';
  // Starter == false means the first player is 'X'
  starter = false;
  heatmap = false;
  average = false;
  // Oponent == true means AI is playing
  opponent = false;
  gameOverMessage = '';
  thinking = false;
  gameOver = false;
  difficulty: string;
  countdown = 5;
  cdTimer;

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionComp: SessionComponent;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.difficulty = this.sessionComp.session.difficulty;
  }

  newGame() {
    clearInterval(this.cdTimer);
    this.gameOver = false;
    this.countdown = 5;
    this.board = new TicTacToeBoard();
    this.switchStarter();
  }

  undo() {
    this.board.undo();
    this.sessionComp.session.undoStats();
  }

  /* Changes the state of the card panel on the left
  to given tab */
  setState(state) {
    this.state = state;
  }

  /* Resets difficulty each turn, validates move, notifies
  parent session, and then performs AI move if required */
  takeTurn(x, y) {
    this.difficulty = this.sessionComp.session.difficulty;
    const move = new Move(x, y, this.board.whoseTurn);
    if (this.board.takeTurn(move)) {
      this.notify.emit({board: this.board, move: move});
      this.getEndMessage();
      if (this.opponent && (this.board.moveLog.length < 9 && !this.board.winner)) {
        this.thinking = true;
        setTimeout(() => this.getComputerMove(this.difficulty), 1000);
      }
    }
    this.gameOver = this.board.winner || this.board.moveLog.length === 9;
  }

  /* Starter can only be switched at beginning of new game */
  switchStarter() {
    this.board.whoseTurn = !this.board.turnsTaken && this.starter ? 'O' : 'X';
  }

  /* Gets the shade of red based on the frequency relative to
  the min and max frequency */
  getHeatColor(value, min, max) {
    const cMax = '0000FF';
    const white = 'FFFFFF';
    const cMin = 'FF0000';
    const ratio = (value - min) / (max - min);
    const r = Math.ceil(parseInt(cMin.substring(0, 2), 16) * ratio + parseInt(white.substring(0, 2), 16) * (1 - ratio));
    const g = Math.ceil(parseInt(cMin.substring(2, 4), 16) * ratio + parseInt(white.substring(2, 4), 16) * (1 - ratio));
    const b = Math.ceil(parseInt(cMin.substring(4, 6), 16) * ratio + parseInt(white.substring(4, 6), 16) * (1 - ratio));
    return `rgba(${r},${g},${b}, 0.75)`;
  }

  /* Returns the heat css style attr for each square.
  Should probably be moved to the session component */
  getHeat(x, y) {
    const sess = this.sessionComp.session;
    const min = sess.minFreq;
    const max = sess.maxFreq;
    const value = sess.moveFreq[x][y];
    if (this.heatmap) {
      return {'background-color': this.getHeatColor(value, min, max) };
    }
  } 

  /* Fancy math to calculate where the crosshair for the average
  position should be located. For example, if the average is 
  [2, 2], then the crosshair will be located right in the middle
  of that square instead of at the corner */
  getAvgPos() {
    let xperc = (this.sessionComp.session.avgSpace.x) / .02;
    xperc += (50 - xperc) * .3333;
    let yperc = (this.sessionComp.session.avgSpace.y) / .02;
    yperc += (50 - yperc) * .3333;
    if (this.average) {
      return {'left': `calc(${xperc}% - 20px)`, 'top': `calc(${yperc}% - 20px)` };
    }
  }

  getComputerMove(difficulty) {
    let move;
    switch (difficulty) {
      case 'random':
        move = this.getRandomMove();
        break;
      case 'offensive':
        move = this.getOffensiveMove();
        break;
      case 'defensive':
        move = this.getDefensiveMove();
        break;
    }
    move.player = this.starter ? 'X' : 'O';

    if (this.board.takeTurn(move)) {
      this.notify.emit({board: this.board, move: move});
      this.getEndMessage();
    }
    this.thinking = false;
  }

  getRandomMove() {
    return this.board.possibleMoves[Math.floor(Math.random() * this.board.possibleMoves.length)];
  }

  // TODO
  getOffensiveMove() {
    return this.getRandomMove();
  }

  // TODO
  getDefensiveMove() {
    return this.getRandomMove();
  }

  // TODO: More difficulties

  getEndMessage() {
    if (this.board.winner) {
      this.gameOverMessage = `Congrats to Player ${this.board.winningPlayer} on winning!`;
      this.startCountdown();
    } else if (this.board.moveLog.length === 9) {
      this.gameOverMessage = `No one won! Would you like to play again?`;
      this.startCountdown();
    }
  }

  /* Countdown timer for game auto-restart after it ends */
  startCountdown() {
    // 500ms delay to match Angular/CSS anims
    setTimeout(() => {
      this.cdTimer = setInterval(() => {
        this.countdown--;
        if (!this.countdown) {
          clearInterval(this.cdTimer);
          this.newGame();
        }
      }, 1000);
    }, 500);
  }
}
