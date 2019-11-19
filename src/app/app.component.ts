import { Component, OnInit } from '@angular/core';
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

	constructor(private readonly _boardStateService: BoardStateService) {}

	ngOnInit() {
		this.subscriptions.push(
			this._boardStateService.currActivePlayer.pipe(filter(x => !!x)).subscribe((ap: number) => {
				this.activePlayer = ap;
			}),
			this._boardStateService.readyToSubmit.subscribe(submittable => {
				this.canSubmitMove = submittable;
			})
		);
	}

	submitMove() {
		this._boardStateService.makeMoves();
	}
}
