import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Cell } from '../models/cell';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BoardStateService } from '../services/board-state.service';

@Component({
    selector: 'checkers-cell',
    templateUrl: './cell.component.html',
    styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
    @Input() cell: Cell;
    @Input() style: number;
    clickableCells: number[] = [];
    gameOver: boolean;
    highlighted: boolean = false;
    id: number;
    isOnSquare: boolean;
    subscriptions: Subscription[] = [];
    tracked: boolean = false;

    constructor(private readonly boardStateService: BoardStateService) { }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s && s.unsubscribe());
        this.subscriptions = [];
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.boardStateService.currClickableCellIds.pipe(filter(x => !!x)).subscribe((clickables: number[]) => {
                this.clickableCells = clickables;
            }),
            this.boardStateService.currMoveChainIds.pipe(filter(x => !!x)).subscribe((trackedCells: number[]) => {
                this.tracked = false;
                trackedCells.forEach(id => {
                    if (id === this.id) {
                        this.tracked = true;
                    }
                });
            })
        );
        this.isOnSquare = (this.cell.position[0] % 2) + (this.cell.position[1] % 2) === 1;
        this.id = this.cell.id;
    }

    @HostListener('click') onClick(): void {
        if (this.clickableCells.includes(this.id) || this.tracked) {
            this.boardStateService.cellClicked(this.cell);
        }
    }

    @HostListener('mouseover') onHover(): void {
        if (this.clickableCells.includes(this.id) || this.tracked) {
            this.highlighted = true;
        }
    }

    @HostListener('mouseleave')
    @HostListener('mouseout') onLeave(): void {
        this.highlighted = false;
    }
}
