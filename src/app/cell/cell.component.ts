import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Cell } from '../models/cell';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MoveTrackerService } from '../services/move-tracker.service';

@Component({
	selector: 'checkers-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
	@Input() cell: Cell;
	clickableCells: number[] = []
	gameOver: boolean;
	highlighted: boolean = false;
	id: number;
	isOnSquare: boolean;
	subscriptions: Subscription[] = [];

	constructor(private readonly moveTracker: MoveTrackerService) { }

	ngOnDestroy() {
		this.subscriptions.forEach(s => s && s.unsubscribe());
		this.subscriptions = [];
	}

	ngOnInit() {
		this.subscriptions.push(
			this.moveTracker.currClickableCells.pipe(filter(x => !!x)).subscribe((clickables: number[]) => {
				this.clickableCells = clickables;
			})
		);
		this.isOnSquare = (this.cell.position[0] % 2) + (this.cell.position[1] % 2) === 1;
		this.id = Number(`${this.cell.position[0]}${this.cell.position[1]}`);
	}

	cellClicked() { }

	@HostListener('mouseover') onHover() {
		if (this.cell.player === 1 && this.cell.value && this.clickableCells.includes(this.id)) {
			this.highlighted = true;
		}
	}

	@HostListener('mouseleave')
	@HostListener('mouseout') onLeave() {
		this.highlighted = false;
	}
}
