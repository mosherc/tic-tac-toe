import { Component, OnInit } from '@angular/core';
import { TicTacToeBoard } from '../tic-tac-toe-board';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {

  board: TicTacToeBoard = new TicTacToeBoard();
  //console.log(this.board);

  constructor() { }

  ngOnInit() {
  }









  newGame() {
    this.board = new TicTacToeBoard();
    console.log(this.board);
  }

}
