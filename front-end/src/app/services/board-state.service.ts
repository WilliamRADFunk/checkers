import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import * as uuidv1 from 'uuid/v1';
import { Socket } from 'ngx-socket-io';

import { Board } from '../models/board';
import { Cell } from '../models/cell';
import { aiDecider } from '../utils/ai-decider';
import { checkForEndGame } from '../utils/check-for-endgame';
import { cloneBoard } from '../utils/clone-board';
import { convertIdsToCells } from '../utils/convert-ids-to-cells';
import { crownKings } from '../utils/crown-kings';
import { findClickableCells } from '../utils/find-clickable-cells';
import { makeMoves } from '../utils/make-moves';
import { resetBoard } from '../utils/reset-board';

@Injectable({
    providedIn: 'root'
})
export class BoardStateService {
    private readonly _activePlayer: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    private _aiDifficulty = 1;
    private readonly _boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>(resetBoard());
    private readonly _clickableCellIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    // 0 == not over, 1 == player 1 wins, 2 == player 2 wins.
    private readonly _gameStatus: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _hostedRoomCode: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private readonly _id: string = uuidv1.default();
    private _joiningRoom: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _memoizationTable: { [key: string]: number } = {};
    private _moveChainCells: Cell[] = [];
    private readonly _moveChainIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    private _onlineMethod = 1;
    // 1 == Local human player, 2 == AI player, 3 == Online human player.
    private _opponent: number = 1;
    private readonly _opponentPlayerNumber: BehaviorSubject<number> = new BehaviorSubject<number>(2);
    private readonly _opponentThinking: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private readonly _peoplePlaying: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private readonly _playersNumber: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    private readonly _readyToSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private readonly _styleOFPieces: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private readonly _timer: BehaviorSubject<number> = new BehaviorSubject<number>(20);
    private _timerId: number;

    readonly currActivePlayer: Observable<number> = this._activePlayer.asObservable();
    readonly currBoardState: Observable<Board> = this._boardState.asObservable();
    readonly currClickableCellIds: Observable<number[]> = this._clickableCellIds.asObservable();
    readonly currGameStatus: Observable<number> = this._gameStatus.asObservable();
    readonly currHostedRoomCode: Observable<string> = this._hostedRoomCode.asObservable();
    readonly currJoiningRoom: Observable<boolean> = this._joiningRoom.asObservable();
    readonly currMoveChainIds: Observable<number[]> = this._moveChainIds.asObservable();
    readonly currOpponentPlayerNumber: Observable<number> = this._opponentPlayerNumber.asObservable();
    readonly currOpponentThinking: Observable<boolean> = this._opponentThinking.asObservable();
    readonly currPeoplePlaying: Observable<number> = this._peoplePlaying.asObservable();
    readonly currPlayerNumber: Observable<number> = this._playersNumber.asObservable();
    readonly currStyleOFPieces: Observable<number> = this._styleOFPieces.asObservable();
    readonly currTimer: Observable<number> = this._timer.asObservable();
    readonly readyToSubmit: Observable<boolean> = this._readyToSubmit.asObservable();

    constructor(private socket: Socket) {
        this.socket.on('updated people count', data => {
            this._peoplePlaying.next((data && data.people) || this._peoplePlaying.value);
        });
        this.socket.on('joined room', data => {
            let thisPlayer = false;
            if (data && data.playerNumber && data.id === this._id) {
                this._playersNumber.next(data.playerNumber);
                thisPlayer = true;
            }

            if (data && data.roomFull) {
                if (!this._hostedRoomCode.value && data.roomCode) {
                    this._hostedRoomCode.next(data.roomCode);
                }
                setTimeout(() => {
                    this._joiningRoom.next(false);
                    if ((thisPlayer && this._activePlayer.value === data.playerNumber)
                        || this._activePlayer.value === this._playersNumber.value) {
                        this._clickableCellIds.next(
                            findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
                    } else {
                        this._clickableCellIds.next([]);
                        this._readyToSubmit.next(false);
                        this._moveChainIds.next([]);
                        this._moveChainCells = [];
                    }
                    this._clearTimeout();
                    this._setInterval();
                }, 100);
            }
        });
        this.socket.on('move made', data => {
            if (data && data.roomCode !== this._hostedRoomCode.value) {
                return;
            }
            this._clearTimeout();
            this._gameStatus.next(data.board.gameStatus);
            if (data.id !== this._id) {
                this._activePlayer.next(data.board.activePlayer || this._activePlayer.value);
                this._boardState.next(data.board && data.board.board || this._boardState.value);
                // If game is over don't bother calculating moves.
                if (data.board.gameStatus) {
                    return;
                }
                // Calculate moves on new board state based off of who active player is this turn.
                if (data.board.activePlayer === this._playersNumber.value) {
                    this._opponentThinking.next(false);
                    this._clickableCellIds.next(findClickableCells(data.board.activePlayer, data.board, []));
                } else {
                    this._clickableCellIds.next([]);
                    this._readyToSubmit.next(false);
                    this._moveChainIds.next([]);
                    this._moveChainCells = [];
                }
                this._setInterval();
            }
        });
    }

    private _changeTurn(): void {
        this._moveChainCells.length = 0;
        this._moveChainIds.next([]);

        crownKings(this._boardState.value);
        this._activePlayer.next(this._activePlayer.value === 1 ? 2 : 1);

        this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));

        this._gameStatus.next(checkForEndGame(this._activePlayer.value, this._clickableCellIds.value.length));

        if (!this._gameStatus.value && this._opponent === 2 && this._activePlayer.value === this._opponentPlayerNumber.value) {
            this._takeAITurn();
        } else if (!this._gameStatus.value && this._opponent === 3 && this._activePlayer.value === this._opponentPlayerNumber.value) {
            this._opponentThinking.next(true);
        } else {
            this._opponentThinking.next(false);
        }
    }

    private _clearTimeout() {
        clearInterval(this._timerId);
        this._timerId = null;
    }

    private _registerHostRoom(playerNumber: number): void {
        this.socket.emit('new player', { roomCode: this._hostedRoomCode.value, player: playerNumber, id: this._id });
    }

    private _setInterval() {
        this._timer.next(20);
        this._timerId = window.setInterval(() => {
            if (this._timer.value <= 0) {
                this._clearTimeout();
                if (this._activePlayer.value !== this._playersNumber.value) {
                    this.disconnectSocket(true);
                } else {
                    this._gameStatus.next(this._activePlayer.value === 1 ? 2 : 1);
                }
            } else {
                this._timer.next(this._timer.value - 1);
            }
        }, 1000);
    }

    private _takeAITurn(): void {
        const availablePieces = this._clickableCellIds.value;
        // Have AI make a move.
        this._opponentThinking.next(true);
        this._clickableCellIds.next([]);
        setTimeout(() => {
            const result = aiDecider(
                cloneBoard(this._boardState.value),
                this._opponentPlayerNumber.value,
                this._activePlayer.value,
                availablePieces,
                this._aiDifficulty,
                this._memoizationTable);
            this.makeMoves(result.moveChainIds, convertIdsToCells(this._boardState.value, result.moveChainIds));
        }, 2000);
    }

    public cellClicked(cell: Cell): void {
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

    public changeDifficulty(difficulty: number): void {
        // To prevent the AI from getting smarter with each game, it must have its memory wiped after each play.
        this._aiDifficulty = difficulty;
    }

    public changeOnlineMethod(method: number): void {
        // If other than hosting, flush provided gameroom code.
        if (method !== 1 && this._hostedRoomCode.value) {
            this._hostedRoomCode.next('');
        } else if (method === 1 && !this._hostedRoomCode.value) {
            this._hostedRoomCode.next(uuidv1.default());
        }
        this._onlineMethod = method;
    }

    public changeOpponent(opponent: number): void {
        // If hosting, generate gameroom code. Otherwise, flush code to make room for user entered version.
        if (opponent === 3) {
            this._hostedRoomCode.next(uuidv1.default());
        } else {
            this._hostedRoomCode.next('');
        }
        this._opponent = opponent;
    }

    public changePlayerNumber(playerNumber: number): void {
        this._playersNumber.next(playerNumber);
        const opponent = playerNumber === 1 ? 2 : 1;
        this._opponentPlayerNumber.next(opponent);
        if (this._opponent === 2 && this._activePlayer.value === opponent) {
            this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
            this._takeAITurn();
        } else if (this._opponent === 3 && this._onlineMethod === 1) {
            this._registerHostRoom(playerNumber);
        } else {
            this._clickableCellIds.next(findClickableCells(this._activePlayer.value, this._boardState.value, this._moveChainCells));
        }
    }
    public changeStyleOfPieces(style: number): void {
        this._styleOFPieces.next(style);
    }

    public disconnectSocket(opponentTimedout?: boolean) {
        console.log('quit', this._id);
        this.socket.emit('quit', { id: this._id, timedout: opponentTimedout });
    }

    public getActivePlayer(): number {
        return this._activePlayer.value;
    }

    public getOnlineMethod(): number {
        return this._onlineMethod;
    }

    public getOpponent(): number {
        return this._opponent;
    }

    public joinGameroom(code?: string): void {
        this._hostedRoomCode.next(code || '');
        this.socket.emit('new player', { roomCode: code || null, id: this._id });
    }

    public joiningRoom(): void {
        this._joiningRoom.next(true);
    }

    public makeMoves(moveChainIds?: number[], moveChainCells?: Cell[]): void {
        this._readyToSubmit.next(false);
        makeMoves(this._boardState.value, moveChainIds || this._moveChainIds.value, moveChainCells || this._moveChainCells);
        this._changeTurn();
        if (this._opponent === 3) {
            const boardState = this._boardState.value;
            boardState.activePlayer = this._activePlayer.value;
            boardState.gameStatus = this._gameStatus.value;
            this.socket.emit('movement', { board: boardState, id: this._id, roomCode: this._hostedRoomCode.value});
            this._clickableCellIds.next([]);
            this._readyToSubmit.next(false);
            this._moveChainIds.next([]);
            this._moveChainCells = [];
        }
    }

    public reset(playerNumber?: number, opponentPlayerNumber?: number): void {
        this._opponentThinking.next(false);
        this._readyToSubmit.next(false);
        this._playersNumber.next(playerNumber || Math.random() > 0.5 ? 1 : 2);
        this._opponentPlayerNumber.next(opponentPlayerNumber || this._playersNumber.value === 1 ? 2 : 1);
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
