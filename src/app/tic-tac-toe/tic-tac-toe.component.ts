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
  heatmap = false;

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionComp: SessionComponent;

  constructor() { }

  ngOnInit() {
  }

  newGame() {
    this.board = new TicTacToeBoard();
    this.switchStarter();
    if (this.heatmap) { this.getHeatmap(); }
  }

  undo() {
    const move = this.board.undo();
    this.sessionComp.session.undoStats();
    if (this.heatmap) { this.getHeatmap(); }
  }

  setState(state) {
    this.state = state;
  }

  takeTurn(x, y) {
    const move = new Move(x, y, this.board.whoseTurn);
    // this.board.takeTurn(move);
    if (this.board.takeTurn(move)) {
      this.notify.emit({board: this.board, move: move});
      if (this.heatmap) { this.getHeatmap(); }
    }
  }

  switchStarter() {
    if (!this.board.turnsTaken) {
      this.board.whoseTurn = this.starter ? 'O' : 'X';
    }
  }

  toggleHeatmap() {
    if (this.heatmap) { this.getHeatmap(); }
    else { $('td.game-cell').css('background-color', 'white'); }
    // this.getHeatmap();
  }

  getHeatmap() {
    const sess = this.sessionComp.session;
    const min = sess.minFreq;
    const max = sess.maxFreq;
    const self = this;
    console.log("getting heat map");
    if (this.heatmap) {
      $('td.game-cell').each(function(index) {
        const x = Math.floor(index / 3);
        const y = Math.floor(index % 3);
        const heat = sess.moveFreq[x][y];
        const color = self.getHeatColor(heat, min, max);
        //console.log(`${x},${y} : ${color}`);
        $(this).css('background-color', color);
        //console.log($(this).css("background-color"));
      });
    }
  }

  getHeatColor(value, min, max) {
    const cMax = '0000FF';
    const white = 'FFFFFF';
    const cMin = 'FF0000';
    const ratio = (value - min) / (max - min);
    // const hex = function(x) {
    //   x = x.toString(16);
    //   return (x.length == 1) ? '0' + x : x;
    // };

    //if (ratio > 0.5) {
      const r = Math.ceil(parseInt(cMin.substring(0, 2), 16) * ratio + parseInt(white.substring(0, 2), 16) * (1 - ratio));
      const g = Math.ceil(parseInt(cMin.substring(2, 4), 16) * ratio + parseInt(white.substring(2, 4), 16) * (1 - ratio));
      const b = Math.ceil(parseInt(cMin.substring(4, 6), 16) * ratio + parseInt(white.substring(4, 6), 16) * (1 - ratio));
    //} else {
      // const r = Math.ceil(parseInt(white.substring(0, 2), 16) * ratio + parseInt(cMax.substring(0, 2), 16) * (1 - ratio));
      // const g = Math.ceil(parseInt(white.substring(2, 4), 16) * ratio + parseInt(cMax.substring(2, 4), 16) * (1 - ratio));
      // const b = Math.ceil(parseInt(white.substring(4, 6), 16) * ratio + parseInt(cMax.substring(4, 6), 16) * (1 - ratio));
    //}

    return `rgba(${r},${g},${b}, 0.75)`;

  }
}
