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

	constructor(
		private readonly _boardStateService: BoardStateService,
		private modalService: NgbModal) {}

	ngOnInit() {
		this.subscriptions.push(
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
					}).result.then(() => {
							// Already handled this means of closing the modal.
						}, reason => {
							// Since player clicked outside modal, have to handle the restart.
							if (reason === ModalDismissReasons.BACKDROP_CLICK) {
								this.goToMenu();
							}
						});
				}
			})
		);
	}

	changeOpponent(e: number) {
		this._boardStateService.changeOpponent(e);
	}

    enterHelp(e: boolean) {
		console.log('enterHelp');
        this.helpMode = true;
    }

    exitHelp() {
        this.helpMode = false;
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

        this.subscriptions.push(
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
					}).result.then(() => {
							// Already handled this means of closing the modal.
						}, reason => {
							// Since player clicked outside modal, have to handle the restart.
							if (reason === ModalDismissReasons.BACKDROP_CLICK) {
								this.goToMenu();
							}
						});
				}
			})
		);
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
