import { Component, OnDestroy, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Board } from '../models/board';

@Component({
	selector: 'checkers-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy, OnChanges, OnInit {
	public board: Board = {
		cellStates: [
			[
				{
					player: 0,
					playerColor: '',
					position: [0, 0],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [0, 1],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [0, 2],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [0, 3],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [0, 4],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [0, 5],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [0, 6],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [0, 7],
					value: 1
				},
			],
			[
				{
					player: 2,
					playerColor: 'black',
					position: [1, 0],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [1, 1],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [1, 2],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [1, 3],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [1, 4],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [1, 5],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [1, 6],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [1, 7],
					value: 0
				},
			],
			[
				{
					player: 0,
					playerColor: '',
					position: [2, 0],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [2, 1],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [2, 2],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [2, 3],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [2, 4],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [2, 5],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [2, 6],
					value: 0
				},
				{
					player: 2,
					playerColor: 'black',
					position: [2, 7],
					value: 1
				},
			],
			[
				{
					player: 0,
					playerColor: '',
					position: [3, 0],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 1],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 2],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 3],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 4],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 5],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 6],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [3, 7],
					value: 0
				},
			],
			[
				{
					player: 0,
					playerColor: '',
					position: [4, 0],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 1],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 2],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 3],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 4],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 5],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 6],
					value: 0
				},
				{
					player: 0,
					playerColor: '',
					position: [4, 7],
					value: 0
				},
			],
			[
				{
					player: 1,
					playerColor: 'white',
					position: [5, 0],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [5, 1],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [5, 2],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [5, 3],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [5, 4],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [5, 5],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [5, 6],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [5, 7],
					value: 0
				},
			],
			[
				{
					player: 0,
					playerColor: '',
					position: [6, 0],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [6, 1],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [6, 2],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [6, 3],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [6, 4],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [6, 5],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [6, 6],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [6, 7],
					value: 1
				},
			],
			[
				{
					player: 1,
					playerColor: 'white',
					position: [7, 0],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [7, 1],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [7, 2],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [7, 3],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [7, 4],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [7, 5],
					value: 0
				},
				{
					player: 1,
					playerColor: 'white',
					position: [7, 6],
					value: 1
				},
				{
					player: 0,
					playerColor: '',
					position: [7, 7],
					value: 0
				},
			],
		]
	};
	public gameOver: boolean;
	public isLoading: boolean = true;
	public subscriptions: Subscription[] = [];

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
