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
    if (this.heatmap) { this.getHeatmap(); }
  }

  switchStarter() {
    if (!this.board.turnsTaken) {
      this.board.whoseTurn = this.starter ? 'O' : 'X';
    }
  }

  toggleHeatmap() {
    this.heatmap = !this.heatmap;
    // this.getHeatmap();
  }

  getHeatmap() {
    const sess = this.sessionComp.session;
    const min = sess.minFreq;
    const max = sess.maxFreq;
    // heatmap(sess.moveFreq[x][y], sess.minFreq, sess.maxFreq
    if (this.heatmap) {
      $('td.game-cell').each(function(index) {
        console.log("looping through td");
        const x = Math.floor(index/3);
        const y = Math.floor(index%3);
        const heat = sess.moveFreq[x][y];
        console.log(this);
        // NEED TO CHANGE THIS TO PARENT COMPONENT!!!
        //const color = this.getHeatColor(heat, min, max);
        //console.log(`${x},${y} : ${color}`);
        //$(this).css('background-color', color);
        //console.log($(this).css("background-color"));
      });
    }
  }

  getHeatColor(value, min, max) {
    const cMin = '0000FF';
    const cMax = 'FF0000';
    const ratio = (value - min)/(max - min);
    var hex = function(x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
    };
    var r = Math.ceil(parseInt(cMin.substring(0,2), 16) * ratio + parseInt(cMax.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(cMin.substring(2,4), 16) * ratio + parseInt(cMax.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(cMin.substring(4,6), 16) * ratio + parseInt(cMax.substring(4,6), 16) * (1-ratio));
  
    return `rgb(${r},${g},${b})`;
  
  }
}
