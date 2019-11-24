import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Board } from '../models/board';
import { Cell } from '../models/cell';
import { checkForEndGame } from '../utils/check-for-endgame';
import { cloneBoard } from '../utils/clone-board';
import { crownKings } from '../utils/crown-kings';
import { downwardPathValidCheck } from '../utils/downward-path-valid-check';
import { downwardPathValidOptions } from '../utils/downward-path-valid-options';
import { findClickableCells } from '../utils/find-clickable-cells';
import { findPiecesForPlayer } from '../utils/find-pieces-for-player';
import { makeMove } from '../utils/make-move';
import { resetBoard } from '../utils/reset-board';
import { upwardPathValidCheck } from '../utils/upward-path-valid-check';
import { upwardPathValidOptions } from '../utils/upward-path-valid-options';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {
	private readonly _activePlayer: BehaviorSubject<number> = new BehaviorSubject<number>(1);
	private readonly _opponentThinking: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly _boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>(resetBoard());
	private readonly _clickableCellIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	// 0 == not over, 1 == player 1 wins, 2 == player 2 wins.
	private readonly _gameStatus: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private readonly _readyToSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly _moveChainIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	// 1 == Local human player, 2 == AI player, 3 == Online human player.
	private _opponent: number = 1;
	readonly currActivePlayer: Observable<number> = this._activePlayer.asObservable();
	readonly currOpponentThinking: Observable<boolean> = this._opponentThinking.asObservable();
	readonly currBoardState: Observable<Board> = this._boardState.asObservable();
	readonly currClickableCellIds: Observable<number[]> = this._clickableCellIds.asObservable();
	readonly currGameStatus: Observable<number> = this._gameStatus.asObservable();
	readonly currMoveChainIds: Observable<number[]> = this._moveChainIds.asObservable();
	readonly readyToSubmit: Observable<boolean> = this._readyToSubmit.asObservable();

	private _moveChainCells: Cell[] = [];

	constructor() {
		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
	}

	_changeTurn() {
		this._moveChainCells.length = 0;
		this._moveChainIds.next([]);

		crownKings(this._activePlayer.value, this._boardState.value);
		this._activePlayer.next(this._activePlayer.value === 1 ? 2 : 1);

		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));

		this._gameStatus.next(checkForEndGame(this._activePlayer.value, this._clickableCellIds.value.length));

		if (!this._gameStatus.value && this._opponent === 2 && this._activePlayer.value === 2) {
			const availableMoves = this._clickableCellIds.value;
			// Have AI make a move.
			this._opponentThinking.next(true);
			this._clickableCellIds.next([]);

		} else {
			this._opponentThinking.next(false);
		}
	}

	_AiDecider() {

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
		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
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
				makeMove(
					this._boardState.value,
					cellChain[0].position[0],
					cellChain[0].position[1],
					cellChain[1].position[0],
					cellChain[1].position[1],
					[]);
			} else {
				const lowerNum = idChain[0] < idChain[1] ? idChain[0] : idChain[1];
				const diff = Math.abs(idChain[0] - idChain[1]);
				const eliminatedCellId = lowerNum + Math.floor(diff / 2) + (diff % 2);
				const row = Math.floor(eliminatedCellId / 10);
        		const col = eliminatedCellId % 10;
				const pos = this._boardState.value.cellStates[row][col].position;
				makeMove(
					this._boardState.value,
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
		this._boardState.next(resetBoard());
		this._clickableCellIds.next([]);
		this._readyToSubmit.next(false);
		this._moveChainIds.next([]);
		this._moveChainCells = [];
		
		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
	}
}
