import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Board } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  private readonly _boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>({
    cellStates: [
      [
        {
          player: 0,
          playerColor: '',
          position: [0, 0],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [0, 1],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [0, 2],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [0, 3],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [0, 4],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [0, 5],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [0, 6],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [0, 7],
          value: 1
        },
      ],
      [
        {
          player: 2,
          playerColor: 'black',
          position: [1, 0],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [1, 1],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [1, 2],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [1, 3],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [1, 4],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [1, 5],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [1, 6],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [1, 7],
          value: 0
        },
      ],
      [
        {
          player: 0,
          playerColor: '',
          position: [2, 0],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [2, 1],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [2, 2],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [2, 3],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [2, 4],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [2, 5],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [2, 6],
          value: 0
        },
        {
          player: 2,
          playerColor: 'black',
          position: [2, 7],
          value: 1
        },
      ],
      [
        {
          player: 0,
          playerColor: '',
          position: [3, 0],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 1],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 2],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 3],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 4],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 5],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 6],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [3, 7],
          value: 0
        },
      ],
      [
        {
          player: 0,
          playerColor: '',
          position: [4, 0],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 1],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 2],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 3],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 4],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 5],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 6],
          value: 0
        },
        {
          player: 0,
          playerColor: '',
          position: [4, 7],
          value: 0
        },
      ],
      [
        {
          player: 1,
          playerColor: 'white',
          position: [5, 0],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [5, 1],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [5, 2],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [5, 3],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [5, 4],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [5, 5],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [5, 6],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [5, 7],
          value: 0
        },
      ],
      [
        {
          player: 0,
          playerColor: '',
          position: [6, 0],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [6, 1],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [6, 2],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [6, 3],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [6, 4],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [6, 5],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [6, 6],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [6, 7],
          value: 1
        },
      ],
      [
        {
          player: 1,
          playerColor: 'white',
          position: [7, 0],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [7, 1],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [7, 2],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [7, 3],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [7, 4],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [7, 5],
          value: 0
        },
        {
          player: 1,
          playerColor: 'white',
          position: [7, 6],
          value: 1
        },
        {
          player: 0,
          playerColor: '',
          position: [7, 7],
          value: 0
        },
      ],
    ]
  });
  currBoardState: Observable<Board> = this._boardState.asObservable();

  constructor() { }

  makeMove(row1: number, col1: number, row2: number, col2: number, cellsToEliminate: number[][]): void {
    const board = this._boardState.value;
    cellsToEliminate.forEach(cell => {
      const cellState = board.cellStates[cell[0]][cell[1]];
      cellState.player = 0;
      cellState.value = 0;
      cellState.playerColor = '';
    });
    const cellStateBefore = board.cellStates[row1][col1];
    const cellStateAfter = board.cellStates[row2][col2];
    cellStateAfter.player = cellStateBefore.player;
    cellStateAfter.value = cellStateBefore.value;
    cellStateAfter.playerColor = cellStateBefore.playerColor;
  }
}
