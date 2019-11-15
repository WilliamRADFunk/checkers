import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Cell } from '../models/cell';
import { Subscription } from 'rxjs';

@Component({
	selector: 'checkers-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
	@Input() cell: Cell;
	gameOver: boolean;
	isOnSquare: boolean;
	subscriptions: Subscription[] = [];

	constructor() { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit() {
		this.isOnSquare = (this.cell.position[0] % 2) + (this.cell.position[1] % 2) === 1;
	}

	cellClicked() { }

	@HostListener('mouseover') onHover() {
		console.log('mouseover');
	}

	@HostListener('mouseleave') onLeave() {
		console.log('mouseleave');
	}
}
