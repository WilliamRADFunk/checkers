import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Board } from '../models/board';
import { Cell } from '../models/cell';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {
	private _activePlayer: BehaviorSubject<number> = new BehaviorSubject<number>(1);
	private readonly _boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>(this._resetBoard());
	private readonly _clickableCellIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	// 0 == not over, 1 == player 1 wins, 2 == player 2 wins.
	private readonly _gameStatus: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private readonly _readyToSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly _moveChainIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	// 1 == Local human player, 2 == AI player, 3 == Online human player.
	private _opponent: number = 1;
	readonly currActivePlayer: Observable<number> = this._activePlayer.asObservable();
	readonly currBoardState: Observable<Board> = this._boardState.asObservable();
	readonly currClickableCellIds: Observable<number[]> = this._clickableCellIds.asObservable();
	readonly currGameStatus: Observable<number> = this._gameStatus.asObservable();
	readonly currMoveChainIds: Observable<number[]> = this._moveChainIds.asObservable();
	readonly readyToSubmit: Observable<boolean> = this._readyToSubmit.asObservable();

	private _moveChainCells: Cell[] = [];

	constructor() {
		this._clickableCellIds.next(this._findClickableCells(this._activePlayer.value));
	}

	_changeTurn() {
		this._moveChainCells.length = 0;
		this._moveChainIds.next([]);

		this._crownKings();
		this._activePlayer.next(this._activePlayer.value === 1 ? 2 : 1);

		this._clickableCellIds.next(this._findClickableCells(this._activePlayer.value));

		this._checkForEndGame();

		if (!this._gameStatus.value && this._opponent === 2 && this._activePlayer.value === 2) {
			// Have AI make a move.
		}
	}

	_checkForEndGame() {
		if (this._clickableCellIds.value.length) {
			this._gameStatus.next(0); // Player not only has pieces, but available moves too.
		// Player has(n't) pieces left, but none that can move.
		} else {
			this._gameStatus.next(this._activePlayer.value === 2 ? 1 : 2); // Opposite of new player is winner.
		}
	}

	_crownKings() {
		const board = this._boardState.value.cellStates;
		if (this._activePlayer.value === 1) {
			board[0].forEach(cell => {
				if (cell.player === 1 && cell.value === 1) {
					cell.value = 2;
				}
			});
		} else {
			board[7].forEach(cell => {
				if (cell.player === 2 && cell.value === 1) {
					cell.value = 2;
				}
			});
		}
	}

	_downwardPathValidCheck(cell: Cell, board: Cell[][]): boolean {
		const lowerLeft = [cell.position[0] + 1, cell.position[1] - 1];
		const lowerRight = [cell.position[0] + 1, cell.position[1] + 1];
		if (lowerLeft[0] <= 7 && lowerLeft[1] >= 0) {
			if (!board[lowerLeft[0]][lowerLeft[1]].value) {
				return true;
			} else if (board[lowerLeft[0]][lowerLeft[1]].player !== this._activePlayer.value) {
				const jumpedLowerLeft = [lowerLeft[0] + 1, lowerLeft[1] - 1];
				if (jumpedLowerLeft[0] <= 7 && jumpedLowerLeft[1] >= 0 && !board[jumpedLowerLeft[0]][jumpedLowerLeft[1]].value) {
					return true;
				}
			}
		}
		if (lowerRight[0] <= 7 && lowerRight[1] <= 7) {
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
		const lowerRight = [cell.position[0] + 1, cell.position[1] + 1];
		if (lowerLeft[0] <= 7 && lowerLeft[1] >= 0) {
			if (!board[lowerLeft[0]][lowerLeft[1]].value) {
				ids.push(board[lowerLeft[0]][lowerLeft[1]]);
			} else if (board[lowerLeft[0]][lowerLeft[1]].player !== this._activePlayer.value) {
				const jumpedLowerLeft = [lowerLeft[0] + 1, lowerLeft[1] - 1];
				if (jumpedLowerLeft[0] <= 7 && jumpedLowerLeft[1] >= 0 && !board[jumpedLowerLeft[0]][jumpedLowerLeft[1]].value) {
					ids.push(board[jumpedLowerLeft[0]][jumpedLowerLeft[1]]);
				}
			}
		}
		if (lowerRight[0] <= 7 && lowerRight[1] <= 7) {
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

	_findClickableCells(direction: number): number[] {
		const board = this._boardState.value.cellStates;
		if (!this._moveChainCells.length) {
			let playerPieces = this._findPiecesForPlayer();
			playerPieces = playerPieces.filter(cell => {
				// If a king, combine upward and downward, otherwise restrict to direction of player.
				if (cell.value === 2) {
					return this._upperPathValidCheck(cell, board) || this._downwardPathValidCheck(cell, board);
				} else {
					return direction === 1 ? this._upperPathValidCheck(cell, board) : this._downwardPathValidCheck(cell, board);
				}
			});
			const ids = [];
			playerPieces.forEach(cell => {
				ids.push(Number(`${cell.position[0]}${cell.position[1]}`));
			});
			return ids;
		}
		// If a king, combine upward and downward, otherwise restrict to direction of player.
		if (this._moveChainCells[0].value === 2) {
			return [...this._upwardPathValidOptions(this._moveChainCells[this._moveChainCells.length - 1], board), ...this._downwardPathValidOptions(this._moveChainCells[this._moveChainCells.length - 1], board)];
		} else {
			return direction === 1 ? this._upwardPathValidOptions(this._moveChainCells[this._moveChainCells.length - 1], board) : this._downwardPathValidOptions(this._moveChainCells[this._moveChainCells.length - 1], board);
		}
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

	_makeMove(row1: number, col1: number, row2: number, col2: number, cellToEliminate: number[]): void {
		const board = this._boardState.value;
		if (cellToEliminate.length) {
			const cellState = board.cellStates[cellToEliminate[0]][cellToEliminate[1]];
			cellState.player = 0;
			cellState.value = 0;
			cellState.playerColor = '';
		}
		const cellStateBefore = board.cellStates[row1][col1];
		const cellStateAfter = board.cellStates[row2][col2];

		cellStateAfter.player = cellStateBefore.player;
		cellStateAfter.value = cellStateBefore.value;
		cellStateAfter.playerColor = cellStateBefore.playerColor;

		cellStateBefore.player = 0;
		cellStateBefore.value = 0;
		cellStateBefore.playerColor = '';
	}

	_resetBoard() {
		const board = { cellStates: [] };
		for (let row = 0; row < 8; row++) {
			board.cellStates[row] = [];
			for (let col = 0; col < 8; col++) {
				const cell = {
					player: 0,
					playerColor: '',
					position: [row, col],
					value: (row % 2) + (col % 2) === 1 ? 1 : 0
				};
				if (row < 3) {
					cell.player = cell.value ? 2 : 0;
					cell.playerColor = cell.value ? 'black' : '';
				} else if (row > 4) {
					cell.player = cell.value;
					cell.playerColor = cell.value ? 'white' : '';
				} else {
					cell.value = 0;
				}
				board.cellStates[row][col] = cell;
			}
		}
		return board;
	}

	_upperPathValidCheck(cell: Cell, board: Cell[][]): boolean {
		const upperLeft = [cell.position[0] - 1, cell.position[1] - 1];
		const upperRight = [cell.position[0] - 1, cell.position[1] + 1];
		if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
			if (!board[upperLeft[0]][upperLeft[1]].value) {
				return true;
			} else if (board[upperLeft[0]][upperLeft[1]].player !== this._activePlayer.value) {
				const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
				if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
					return true;
				}
			}
		}
		if (upperRight[0] >= 0 && upperRight[1] <= 7) {
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
		const upperRight = [cell.position[0] - 1, cell.position[1] + 1];
		if (upperLeft[0] >= 0 && upperLeft[1] >= 0) {
			if (!board[upperLeft[0]][upperLeft[1]].value) {
				ids.push(board[upperLeft[0]][upperLeft[1]]);
			} else if (board[upperLeft[0]][upperLeft[1]].player !== this._activePlayer.value) {
				const jumpedUpperLeft = [upperLeft[0] - 1, upperLeft[1] - 1];
				if (jumpedUpperLeft[0] >= 0 && jumpedUpperLeft[1] >= 0 && !board[jumpedUpperLeft[0]][jumpedUpperLeft[1]].value) {
					ids.push(board[jumpedUpperLeft[0]][jumpedUpperLeft[1]]);
				}
			}
		}
		if (upperRight[0] >= 0 && upperRight[1] <= 7) {
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
		const index = this._moveChainCells.indexOf(cell);
		if (!index) {
			this._moveChainCells.length = 0;
			this._moveChainIds.next([]);
		} else if (index > 0) {
			this._moveChainCells = this._moveChainCells.slice(0, index);
			this._moveChainCells.forEach(c => {
				chain.push(Number(`${c.position[0]}${c.position[1]}`));
			});
			this._moveChainIds.next(chain);
		} else {
			this._moveChainCells.push(cell);
			this._moveChainCells.forEach(c => {
				chain.push(Number(`${c.position[0]}${c.position[1]}`));
			});
			this._moveChainIds.next(chain);
		}
		// If last move only advanced by one row, it didn't jump, and therefore is ineligible for further movement.
		const idChain = this._moveChainIds.value;
		const chainLength = idChain.length;
		if (chainLength > 1 && Math.abs(idChain[chainLength - 2] - idChain[chainLength - 1]) < 10) {
			this._clickableCellIds.next([]);
			this._readyToSubmit.next(true);
			return;
		}
		if (chainLength > 1) {
			this._readyToSubmit.next(true);
		} else {
			this._readyToSubmit.next(false);
		}
		this._clickableCellIds.next(this._findClickableCells(this._activePlayer.value));
	}

	changeOpponent(opponent: number): void {
		this._opponent = opponent;
	}

	getActivePlayer(): number {
		return this._activePlayer.value;
	}

	getOpponent(): number {
		return this._opponent;
	}

	makeMoves(): void {
		this._readyToSubmit.next(false);
		let idChain = this._moveChainIds.value;
		let cellChain = this._moveChainCells;
    	let chainLength = idChain.length;
		while (chainLength >= 2) {
			if (Math.abs(Math.floor(idChain[0] / 10) - Math.floor(idChain[1] / 10)) < 2) {
				this._makeMove(cellChain[0].position[0], cellChain[0].position[1], cellChain[1].position[0], cellChain[1].position[1], []);
			} else {
				const lowerNum = idChain[0] < idChain[1] ? idChain[0] : idChain[1];
				const diff = Math.abs(idChain[0] - idChain[1]);
				const eliminatedCellId = lowerNum + Math.floor(diff / 2) + (diff % 2);
				const row = Math.floor(eliminatedCellId / 10);
        		const col = eliminatedCellId % 10;
				const pos = this._boardState.value.cellStates[row][col].position;
				this._makeMove(
					cellChain[0].position[0],
					cellChain[0].position[1],
					cellChain[1].position[0],
					cellChain[1].position[1],
					[pos[0], pos[1]]);
			}
			this._moveChainCells.shift();
			this._moveChainIds.next(this._moveChainIds.value.slice(1));

			idChain = this._moveChainIds.value;
			cellChain = this._moveChainCells;
			chainLength = idChain.length;
		}
		this._changeTurn();
	}

	reset() {
		this._gameStatus.next(0);
		this._activePlayer.next(1);
		this._boardState.next(this._resetBoard());
		this._clickableCellIds.next([]);
		this._readyToSubmit.next(false);
		this._moveChainIds.next([]);
		this._moveChainCells = [];
		
		this._clickableCellIds.next(this._findClickableCells(this._activePlayer.value));
	}
}
