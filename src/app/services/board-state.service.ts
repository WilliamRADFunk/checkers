import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { AIChoiceTrack } from '../models/ai-choice-track';
import { Board } from '../models/board';
import { Cell } from '../models/cell';
import { checkForEndGame } from '../utils/check-for-endgame';
import { cloneBoard } from '../utils/clone-board';
import { convertIdsToCells } from '../utils/convert-ids-to-cells';
import { crownKings } from '../utils/crown-kings';
import { downwardPathValidCheck } from '../utils/downward-path-valid-check';
import { downwardPathValidOptions } from '../utils/downward-path-valid-options';
import { findClickableCells } from '../utils/find-clickable-cells';
import { findMaxScore } from '../utils/find-max-score';
import { findPiecesForPlayer } from '../utils/find-pieces-for-player';
import { makeMove } from '../utils/make-move';
import { makeMoves } from '../utils/make-moves';
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
			const availablePieces = this._clickableCellIds.value;
			// Have AI make a move.
			this._opponentThinking.next(true);
			this._clickableCellIds.next([]);
			setTimeout(() => {
				const result = this._AiDecider(cloneBoard(this._boardState.value), 2, availablePieces);
				console.log('_changeTurn', result);
				this.makeMoves(result.moveChainIds, convertIdsToCells(this._boardState.value, result.moveChainIds));
			}, 1000);
		} else {
			this._opponentThinking.next(false);
		}
	}

	_AiDecider(board: Board, aiPlayer: number, startingPieces: number[]): AIChoiceTrack {
		const scores: AIChoiceTrack[] = [];
		startingPieces.forEach(id => {
			const newBoard = cloneBoard(board);
			scores.push(this._AiMove(newBoard, aiPlayer, aiPlayer, [id], 5));
		});
		console.log('_AiDecider before findMaxScore', scores);
		return findMaxScore(scores);
	}

	_AiMove(board: Board, aiPlayer: number, currPlayer: number, moveChainIds: number[], depth: number): AIChoiceTrack {
		// First move of this player's new turn. Check to see if game is already over for this board configuration.
		if (!moveChainIds.length) {
			const clickableIds = findClickableCells(currPlayer, board, []);
			const gameStatus = checkForEndGame(currPlayer, clickableIds.length);
			if (gameStatus) {
				return (gameStatus === aiPlayer) ? { moveChainIds: [], score: Infinity } : { moveChainIds: [], score: -Infinity };
			}
		}
		// Avoids exceeding max callstack. Also allows for variable ai difficulty.
		if (depth <= 0) {
			let aiPlayerPieceCount = 0;
			let nonAiPlayerPieceCount = 0;

			board.cellStates.forEach(row => {
				row.forEach(cell => {
					if (!cell.player) {
						return;
					}
					if (cell.player === aiPlayer) {
						aiPlayerPieceCount += Math.pow(3, cell.value);
					} else {
						nonAiPlayerPieceCount -= Math.pow(3, cell.value);
					}
				});
			});
			return { moveChainIds: [], score: aiPlayerPieceCount + nonAiPlayerPieceCount };
		}

		const moveChainCells = convertIdsToCells(board, moveChainIds);
		const clickableIds = findClickableCells(currPlayer, board, moveChainCells);

		// Player has run out of moves, change turns and continue scoring.
		if (!clickableIds.length) {
			const newBoard = cloneBoard(board);
			const moveChainCells = convertIdsToCells(newBoard, moveChainIds);
			makeMoves(newBoard, moveChainIds, moveChainCells);
			const result = this._AiMove(newBoard, aiPlayer, currPlayer === 2 ? 1 : 2, [], depth - 1);
			result.moveChainIds = moveChainIds;
			console.log('_AiMove 1');
			return result;
		}

		const scores = [];
		clickableIds.forEach(id => {
			// Check scrore if player chooses to end turn, even if more combo jumps are available.
			const newBoard1 = cloneBoard(board);
			const moveChainCells = convertIdsToCells(newBoard1, moveChainIds);
			if (moveChainIds.length) {
				makeMoves(newBoard1, moveChainIds, moveChainCells);
				const result = this._AiMove(newBoard1, aiPlayer, currPlayer === 2 ? 1 : 2, [], depth - 1);
				result.moveChainIds = moveChainIds;
				console.log('_AiMove 2');
				scores.push(result);
			}
			// Check score when player does choose to make the jump.
			const newBoard2 = cloneBoard(board);
			const result = this._AiMove(newBoard2, aiPlayer, currPlayer, [...moveChainIds, id], depth - 1);
			result.moveChainIds = [...moveChainIds, id];
			console.log('_AiMove 3');
			scores.push(result);
		});
		
		return findMaxScore(scores);
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

	makeMoves(moveChainIds?: number[], moveChainCells?: Cell[]): void {
		this._readyToSubmit.next(false);
		makeMoves(this._boardState.value, moveChainIds || this._moveChainIds.value, moveChainCells || this._moveChainCells);
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
