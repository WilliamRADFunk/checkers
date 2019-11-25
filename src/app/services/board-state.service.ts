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
import { convertBoardToKey } from '../utils/convert-board-to-key';
import { checkForCycles } from '../utils/check-for-cycles';

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
	private _memoizationTable = {};

	constructor() {
		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
	}

	_changeTurn() {
		this._moveChainCells.length = 0;
		this._moveChainIds.next([]);

		crownKings(this._boardState.value);
		this._activePlayer.next(this._activePlayer.value === 1 ? 2 : 1);

		this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));

		this._gameStatus.next(checkForEndGame(this._activePlayer.value, this._clickableCellIds.value.length));

		if (!this._gameStatus.value && this._opponent === 2 && this._activePlayer.value === 2) {
			const availablePieces = this._clickableCellIds.value;
			// Have AI make a move.
			this._opponentThinking.next(true);
			this._clickableCellIds.next([]);
			setTimeout(() => {
				console.log('_changeTurn availablePieces', availablePieces);
				const result = this._AiDecider(cloneBoard(this._boardState.value), 2, 2, availablePieces);
				console.log('_changeTurn', result);
				this.makeMoves(result.moveChainIds, convertIdsToCells(this._boardState.value, result.moveChainIds));
			}, 1000);
		} else {
			this._opponentThinking.next(false);
		}
	}

	_AiDecider(board: Board, aiPlayer: number, currPlayer: number, startingPieces: number[]): AIChoiceTrack {
		const scores: AIChoiceTrack[] = [];
		this._getAllMoveChains(board, aiPlayer, startingPieces, 4).forEach(chain => {
			console.log('_AiDecider chain', chain);
			const newBoard = cloneBoard(board);
			makeMoves(newBoard, chain, convertIdsToCells(newBoard, chain));
			crownKings(newBoard);
			const bKey = convertBoardToKey(newBoard, currPlayer === 2 ? 1 : 2);
			if (undefined === this._memoizationTable[bKey]) {
				this._memoizationTable[bKey] = this._AiMove(newBoard, aiPlayer, currPlayer === 2 ? 1 : 2, 4);
			}
			scores.push({ moveChainIds: chain, score: this._memoizationTable[bKey] });
		});
		return findMaxScore(scores);
	}

	_getAllMoveChains(board: Board, currPlayer: number, startingPieces: number[], depth: number): number[][] {
		const results = [];
		startingPieces.forEach(id => {
			const firstMoves = findClickableCells(currPlayer, board, convertIdsToCells(board, [id]));
			firstMoves.forEach(move => {
				results.push(this._getMoveChains(board, currPlayer, [id, move], depth));
			});
		});
		const allChains = [];
		results.forEach(chains => {
			chains.forEach(chain => {
				allChains.push(chain);
			});
		});
		return allChains;
	}

	_getMoveChains(board: Board, currPlayer: number, previousChain: number[], depth: number): number[][] {
		const newMoves = findClickableCells(currPlayer, board, convertIdsToCells(board, previousChain));
		// Base case: No moves left to make along this path.
		if (!newMoves.length) {
			return [previousChain];
		}
		// Still some moves on this path available. See where they take us.
		const results = [];
		newMoves.forEach(move => {
			const prospectiveChain = [...previousChain, move];
			if (!checkForCycles(prospectiveChain)) {
				this._getMoveChains(board, currPlayer, [...previousChain, move], depth).forEach(chain => {
					results.push(chain);
				});
			}
		});
		return [previousChain, ...results];
	}

	_AiMove(board: Board, aiPlayer: number, currPlayer: number, depth: number): number {
		const moveChainCells = convertIdsToCells(board, []);
		const clickableIds = findClickableCells(currPlayer, board, moveChainCells);
		// First move of this player's new turn. Check to see if game is already over for this board configuration.
		if (!clickableIds.length) {
			const gameStatus = checkForEndGame(currPlayer, clickableIds.length);
			const score = ((gameStatus === aiPlayer) ? Infinity : -Infinity) - depth;
			return score;
		}
		// Avoids exceeding max callstack. Also allows for variable ai difficulty.
		if (aiPlayer === currPlayer && depth <= 0) {
			let aiPlayerPieceCount = 0;
			let nonAiPlayerPieceCount = 0;

			board.cellStates.forEach(row => {
				row.forEach(cell => {
					if (!cell.player) {
						return;
					}
					if (cell.player === aiPlayer) {
						aiPlayerPieceCount += (10 * cell.value);
					} else {
						nonAiPlayerPieceCount -= (10 * cell.value);
					}
				});
			});
			const score = aiPlayerPieceCount + nonAiPlayerPieceCount;
			return score;
		}

		const scores = [];
		this._getAllMoveChains(board, currPlayer, clickableIds, depth).forEach(chain => {
			const newBoard = cloneBoard(board);
			makeMoves(newBoard, chain, convertIdsToCells(newBoard, chain));
			crownKings(newBoard);
			const bKey = convertBoardToKey(newBoard, currPlayer === 2 ? 1 : 2);
			if (undefined !== this._memoizationTable[bKey]) {
				scores.push(this._memoizationTable[bKey]);
			} else {
				this._memoizationTable[bKey] = this._AiMove(newBoard, aiPlayer, currPlayer === 2 ? 1 : 2, depth - 1);
				scores.push(this._memoizationTable[bKey]);
			}
		});
		if (currPlayer === aiPlayer) {
			return Math.max(...scores);
		} else {
			return Math.min(...scores);
		}
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
				chain.push(c.id);
			});
			this._moveChainIds.next(chain);
		} else {
			this._moveChainCells.push(cell);
			this._moveChainCells.forEach(c => {
				chain.push(c.id);
			});
			this._moveChainIds.next(chain);
		}
		// If last move only advanced by one row, it didn't jump, and therefore is ineligible for further movement.
		const idChain = this._moveChainIds.value;
		const chainLength = idChain.length;
		if (chainLength > 1 && Math.abs(idChain[chainLength - 2] - idChain[chainLength - 1]) < 12) {
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
