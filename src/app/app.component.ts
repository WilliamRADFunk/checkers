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
	activePlayer: number;
	private subscriptions: Subscription[] = [];

	constructor(private readonly boardStateService: BoardStateService) {}

	ngOnInit() {
		this.subscriptions.push(
			this.boardStateService.currActivePlayer.pipe(filter(x => !!x)).subscribe((ap: number) => {
				this.activePlayer = ap;
			})
		);
	}
}
