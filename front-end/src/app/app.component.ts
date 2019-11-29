import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BoardStateService } from './services/board-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private subscriptions: Subscription[] = [];

    public activePlayer: number;
    public canSubmitMove: boolean = false;
    @ViewChild('content', { static: true }) content: any;
    public gameOver: boolean = false;
    public gameOverAck: boolean = true;
    public helpMode: boolean = false;
    public opponentIsThinking: boolean = false;

    constructor(
        private readonly _boardStateService: BoardStateService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this._subscriptionSetup();
    }

    private _subscriptionSetup() {
        this.subscriptions.push(
            this._boardStateService.currOpponentThinking.subscribe(isThinking => {
                this.opponentIsThinking = isThinking;
            }),
            this._boardStateService.currActivePlayer.pipe(filter(x => !!x)).subscribe((ap: number) => {
                this.activePlayer = ap;
            }),
            this._boardStateService.readyToSubmit.subscribe(submittable => {
                this.canSubmitMove = submittable;
            }),
            this._boardStateService.currGameStatus.subscribe(gs => {
                this.gameOver = !!gs;
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

    changeDifficulty(e: number): void {
        this._boardStateService.changeDifficulty(e);
    }

    changeOnlineMethod(e: number): void {
        this._boardStateService.changeOnlineMethod(e);
    }

    changeOpponent(e: number) {
        this._boardStateService.changeOpponent(e);
    }

    enterHelp(e: boolean) {
        this.helpMode = true;
    }

    exitHelp() {
        this.helpMode = false;
    }

    getPlayerTurnMsg(): string {
        if (this.activePlayer === 1) {
            return 'Your Turn';
        } else if (this._boardStateService.getOpponent() === 2) {
            return '(AI) Player 2\'s Turn';
        } else {
            return '(Human) Player 2\'s Turn';
        }
    }

    goToMenu() {
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
        this.subscriptions.length = 0;

        this.gameOver = false;
        this.helpMode = false;
        this.gameOverAck = true;

        this._boardStateService.reset();

        this._subscriptionSetup();
    }

    showNavigationPanel(): boolean {
        return !this.helpMode && !this.gameOverAck;
    }

    showStartMenu(): boolean {
        return !this.helpMode && this.gameOverAck;
    }

    startGame(): void {
        this.gameOverAck = false;
    }

    submitMove(): void {
        this._boardStateService.makeMoves();
    }
}
