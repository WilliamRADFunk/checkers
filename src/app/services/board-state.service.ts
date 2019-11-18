import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Board } from '../models/board';
import { Cell } from '../models/cell';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {
	private _activePlayer: BehaviorSubject<number> = new BehaviorSubject<number>(1);
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
	private readonly _clickableCells: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	private readonly _moveChainCells: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	readonly currActivePlayer: Observable<number> = this._activePlayer.asObservable();
	readonly currBoardState: Observable<Board> = this._boardState.asObservable();
	readonly currClickableCells: Observable<number[]> = this._clickableCells.asObservable();
	readonly currMoveChainCells: Observable<number[]> = this._moveChainCells.asObservable();

	private _moveChain: Cell[] = [];

	constructor() {
		this._clickableCells.next(this._findClickableCellsUpward());
  }
  
  _downwardPathValidCheck(cell: Cell, board: Cell[][]): boolean {
    const lowerLeft = [cell.position[0] + 1, cell.position[1] - 1];
    const lowerRight = [cell.position[0] + 1, cell.position[1] - 1];
    if (lowerLeft[0] <= 7 && lowerLeft[1] >= 0) {
      if (!board[lowerLeft[0]][lowerLeft[1]].value) {
        return true;
      } else if (board[lowerLeft[0]][lowerLeft[1]].player !== this._activePlayer.value) {
        const jumpedLowerLeft = [lowerLeft[0] + 1, lowerLeft[1] - 1];
        if (jumpedLowerLeft[0] <= 7 && jumpedLowerLeft[1] >= 0 && !board[jumpedLowerLeft[0]][jumpedLowerLeft[1]].value) {
          return true;
        }
      }
    } else if (lowerRight[0] <= 7 && lowerRight[1] <= 7) {
      if (!board[lowerRight[0]][lowerRight[1]].value) {
        return true;
      } else if (board[lowerRight[0]][lowerRight[1]].player !== this._activePlayer.value) {
        const jumpedlowerRight = [lowerRight[0] + 1, lowerRight[1] + 1];
        if (jumpedlowerRight[0] <= 7 && jumpedlowerRight[1] <= 7 && !board[jumpedlowerRight[0]][jumpedlowerRight[1]].value) {
          return true;
        }
      }
    }
    return false;
  }
  
  _downwardPathValidOptions(cell: Cell, board: Cell[][]): number[] {
    const ids = [];
    const lowerLeft = [cell.position[0] + 1, cell.position[1] - 1];
    const lowerRight = [cell.position[0] + 1, cell.position[1] - 1];
    if (lowerLeft[0] <= 7 && lowerLeft[1] >= 0) {
      if (!board[lowerLeft[0]][lowerLeft[1]].value) {
        ids.push(board[lowerLeft[0]][lowerLeft[1]]);
      } else if (board[lowerLeft[0]][lowerLeft[1]].player !== this._activePlayer.value) {
        const jumpedLowerLeft = [lowerLeft[0] + 1, lowerLeft[1] - 1];
        if (jumpedLowerLeft[0] <= 7 && jumpedLowerLeft[1] >= 0 && !board[jumpedLowerLeft[0]][jumpedLowerLeft[1]].value) {
          ids.push(board[jumpedLowerLeft[0]][jumpedLowerLeft[1]]);
        }
      }
    } else if (lowerRight[0] <= 7 && lowerRight[1] <= 7) {
      if (!board[lowerRight[0]][lowerRight[1]].value) {
        ids.push(board[lowerRight[0]][lowerRight[1]]);
      } else if (board[lowerRight[0]][lowerRight[1]].player !== this._activePlayer.value) {
        const jumpedlowerRight = [lowerRight[0] + 1, lowerRight[1] + 1];
        if (jumpedlowerRight[0] <= 7 && jumpedlowerRight[1] <= 7 && !board[jumpedlowerRight[0]][jumpedlowerRight[1]].value) {
          ids.push(board[jumpedlowerRight[0]][jumpedlowerRight[1]]);
        }
      }
    }
    return ids.map(c => Number(`${c.position[0]}${c.position[1]}`));
  }

	_findClickableCells(): number[] {
		if (this._activePlayer.value === 1) {
			return this._findClickableCellsUpward();
		}
		return this._findClickableCellsDownward();
	}

	_findClickableCellsDownward(): number[] {
		const board = this._boardState.value.cellStates;
		if (!this._moveChain.length) {
			const playerPieces = this._findPiecesForPlayer();
			playerPieces.filter(cell => {
				return this._downwardPathValidCheck(cell, board);
			});
			const ids = [];
			playerPieces.forEach(cell => {
				ids.push(Number(`${cell.position[0]}${cell.position[1]}`));
			});
			return ids;
    }
    return this._downwardPathValidOptions(this._moveChain[this._moveChain.length - 1], board);
	}

	_findClickableCellsUpward(): number[] {
    const board = this._boardState.value.cellStates;
		if (!this._moveChain.length) {
			const playerPieces = this._findPiecesForPlayer();
			playerPieces.filter(cell => {
				return this._upwardPathValidOptions(cell, board);
			});
			const ids = [];
			playerPieces.forEach(cell => {
				ids.push(Number(`${cell.position[0]}${cell.position[1]}`));
			});
			return ids;
    }
    return this._upwardPathValidOptions(this._moveChain[this._moveChain.length - 1], board);
	}

	_findPiecesForPlayer(): Cell[] {
		const cellStates = this._boardState.value.cellStates;
		const playerPieces = [];
		cellStates.forEach(row => {
			row.forEach(cell => {
				if (cell.player === this._activePlayer.value) {
					playerPieces.push(cell);
				}
			});
		});
		return playerPieces;
  }

  _upperPathValidCheck(cell: Cell, board: Cell[][]): boolean {
    const upperLeft = [cell.position[0] - 1, cell.position[1] - 1];
    const upperRight = [cell.position[0] - 1, cell.position[1] - 1];
    if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
      if (!board[upperLeft[0]][upperLeft[1]].value) {
        return true;
      } else if (board[upperLeft[0]][upperLeft[1]].player !== this._activePlayer.value) {
        const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
        if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
          return true;
        }
      }
    } else if (upperRight[0] >= 0 && upperRight[1] <= 7) {
      if (!board[upperRight[0]][upperRight[1]].value) {
        return true;
      } else if (board[upperRight[0]][upperRight[1]].player !== this._activePlayer.value) {
        const jumpedUpperRight = [upperRight[0] - 1, upperRight[1] + 1];
        if (jumpedUpperRight[0] >= 0 && jumpedUpperRight[1] <= 7 && !board[jumpedUpperRight[0]][jumpedUpperRight[1]].value) {
          return true;
        }
      }
    }
    return false;
  }
  
  _upwardPathValidOptions(cell: Cell, board: Cell[][]): number[] {
    const ids = [];
    const upperLeft = [cell.position[0] - 1, cell.position[1] - 1];
    const upperRight = [cell.position[0] - 1, cell.position[1] - 1];
    if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
      if (!board[upperLeft[0]][upperLeft[1]].value) {
        ids.push(board[upperLeft[0]][upperLeft[1]]);
      } else if (board[upperLeft[0]][upperLeft[1]].player !== this._activePlayer.value) {
        const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
        if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
          ids.push(board[jumpedUpperLeft[0]][jumpedUpperLeft[1]]);
        }
      }
    } else if (upperRight[0] >= 0 && upperRight[1] <= 7) {
      if (!board[upperRight[0]][upperRight[1]].value) {
        ids.push(board[upperRight[0]][upperRight[1]]);
      } else if (board[upperRight[0]][upperRight[1]].player !== this._activePlayer.value) {
        const jumpedUpperRight = [upperRight[0] - 1, upperRight[1] + 1];
        if (jumpedUpperRight[0] >= 0 && jumpedUpperRight[1] <= 7 && !board[jumpedUpperRight[0]][jumpedUpperRight[1]].value) {
          ids.push(board[jumpedUpperRight[0]][jumpedUpperRight[1]]);
        }
      }
    }
    return ids.map(c => Number(`${c.position[0]}${c.position[1]}`));
  }

	cellClicked(cell: Cell): void {
		const chain = [];
		const index = this._moveChain.indexOf(cell);
		console.log('cellClicked', index);
		if (!index) {
			this._moveChain.length = 0;
			this._moveChainCells.next([]);
			this._clickableCells.next(this._findPiecesForPlayer());
		} else if (index > 0) {
			this._moveChain = this._moveChain.slice(0, index);
			this._moveChain.forEach(c => {
				chain.push(Number(`${c.position[0]}${c.position[1]}`));
			});
			this._moveChainCells.next(chain);
			this._clickableCells.next(this._findClickableCells());
		} else {
			chain.push(...this._moveChainCells.value);
			this._moveChain.push(cell);
			this._moveChain.forEach(c => {
				chain.push(Number(`${c.position[0]}${c.position[1]}`));
			});
			this._moveChainCells.next(chain);
			this._clickableCells.next(this._findClickableCells());
		}
	}

	getActivePlayer(): number {
		return this._activePlayer.value;
	}

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

		this._activePlayer.next(this._activePlayer.value === 1 ? 2 : 1);
		this._clickableCells.next(this._findPiecesForPlayer());
	}
}
