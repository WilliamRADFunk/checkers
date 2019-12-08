import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { BoardStateService } from './services/board-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    private _gameroomCodeByUser: string = '';
    private _onlineMethod: number = 1;
    private _opponent: number = 1;
    private _subscriptions: Subscription[] = [];

    public activePlayer: number;
    public canSubmitMove: boolean = false;
    @ViewChild('content', { static: true }) content: any;
    public gameOver: number = 0;
    public gameOverAck: boolean = true;
    public gameroomCode: string;
    public helpMode: boolean = false;
    public isJoiningRoom: boolean = false;
    public opponent: number = 1;
    public opponentIsThinking: boolean = false;
    public opponentPlayerNumber: number;
    public peoplePlaying: number = 0;
    public playerNumber: number;
    public timer: number = 0;

    constructor(
        private readonly _boardStateService: BoardStateService,
        private modalService: NgbModal) { }

    ngOnDestroy() {
        this._boardStateService.disconnectSocket();

        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
        this._subscriptions.forEach(sub => sub && sub.unsubscribe());
        this._subscriptions.length = 0;
    }

    ngOnInit() {
        this._subscriptionSetup();
    }

    private _subscriptionSetup(): void {
        this._subscriptions.push(
            this._boardStateService.currPeoplePlaying
                .subscribe(numPeople => {
                    this.peoplePlaying = numPeople;
                }),
            this._boardStateService.currTimer
                .subscribe(time => {
                    this.timer = time;
                }),
            this._boardStateService.currOpponentThinking
                .subscribe(isThinking => {
                    this.opponentIsThinking = isThinking;
                }),
            this._boardStateService.currActivePlayer
                .pipe(filter(x => !!x))
                .subscribe((ap: number) => {
                    this.activePlayer = ap;
                }),
            this._boardStateService.currJoiningRoom
                .subscribe(isJoiningRoom => {
                    this.isJoiningRoom = isJoiningRoom;
                }),
            this._boardStateService.currPlayerNumber
                .pipe(filter(x => !!x))
                .subscribe((pn: number) => {
                    this.playerNumber = pn;
                }),
            this._boardStateService.currPlayerNumber
                .pipe(filter(x => !!x))
                .subscribe((opn: number) => {
                    this.opponentPlayerNumber = opn;
                }),
            this._boardStateService.readyToSubmit
                .subscribe(submittable => {
                    this.canSubmitMove = submittable;
                }),
            this._boardStateService.currHostedRoomCode
                .pipe(distinctUntilChanged())
                .subscribe(grCode => {
                    this.gameroomCode = grCode;
                }),
            this._boardStateService.currGameStatus
                .subscribe(gs => {
                    this.gameOver = gs;
                    if (this.gameOver) {
                        this.modalService.open(this.content, {
                            centered: true,
                            size: 'lg',
                            windowClass: 'transparent-modal'
                        })
                        .result
                        .then(() => {
                            // Already handled this means of closing the modal.
                        },
                        (reason) => {
                            // Since player clicked outside modal, have to handle the restart.
                            if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                                this.goToMenu();
                            }
                        });
                        // Not ideal, but for mysterious reasons the exit button tooltip always starts open
                        setTimeout(() => {
                            document.getElementById('modalTooltip').blur();
                        }, 0);
                    }
                })
        );
    }

    public changeDifficulty(e: number): void {
        this._boardStateService.changeDifficulty(e);
    }

    public changeStyle(e: number): void {
        this._boardStateService.changeStyleOfPieces(e);
    }

    public changeOnlineMethod(e: number): void {
        this._onlineMethod = e;
        this._boardStateService.changeOnlineMethod(e);
    }

    public changeOpponent(e: number): void {
        this._opponent = e;
        this.opponent = e;
        this._boardStateService.changeOpponent(e);
    }

    public enterHelp(e: boolean): void {
        this.helpMode = true;
    }

    public exitHelp(): void {
        this.helpMode = false;
    }

    public gameroomCodeEntered(code: string): void {
        this._gameroomCodeByUser = code;
    }

    public getPlayerTurnMsg(): string {
        if (this._opponent === 1) {
            return `(Human) Player ${this.activePlayer}\'s Turn`;
        } else if (this.activePlayer === this.playerNumber) {
            return 'Your Turn';
        } else if (this._boardStateService.getOpponent() === 2) {
            return `(AI) Player ${this.opponentPlayerNumber}\'s Turn`;
        } else {
            return `(Human) Player ${this.activePlayer}\'s Turn`;
        }
    }

    public goToMenu(): void {
        this._boardStateService.disconnectSocket();

        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
        this._subscriptions.forEach(sub => sub && sub.unsubscribe());
        this._subscriptions.length = 0;

        this.gameOver = 0;
        this.helpMode = false;
        this.gameOverAck = true;

        this._boardStateService.reset();

        this._subscriptionSetup();
    }

    public showNavigationPanel(): boolean {
        return !this.helpMode && !this.gameOverAck;
    }

    public showStartMenu(): boolean {
        return !this.helpMode && this.gameOverAck;
    }

    public startGame(playerNumber: number): void {
        if (this._opponent === 3) {
            switch (this._onlineMethod) {
                case 1: {
                    this._boardStateService.joiningRoom();
                    this._boardStateService.changePlayerNumber(playerNumber);
                    break;
                }
                case 2: {
                    this._boardStateService.joiningRoom();
                    this._boardStateService.joinGameroom(this._gameroomCodeByUser);
                    break;
                }
                case 3: {
                    this._boardStateService.joiningRoom();
                    this._boardStateService.joinGameroom();
                    break;
                }
            }
        } else {
            this._boardStateService.changePlayerNumber(playerNumber);
        }
        this.gameOverAck = false;
    }

    public submitMove(): void {
        this._boardStateService.makeMoves();
    }
}
