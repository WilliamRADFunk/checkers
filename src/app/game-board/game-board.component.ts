import { Component, OnDestroy, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Board } from '../models/board';

@Component({
	selector: 'checkers-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy, OnChanges, OnInit {
	@Input() board: Board;
	gameOver: boolean;
	isLoading: boolean = true;
	subscriptions: Subscription[] = [];

	constructor() { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit() {}

	ngOnChanges(e: SimpleChanges) {
		if (e.board && e.board.currentValue) {
			setTimeout(() => {
				this.board = e.board.currentValue;
				this.isLoading = false;
			}, 0);
		} else if (e.board && !e.board.currentValue) {
			this.isLoading = true;
		}
	}
}
