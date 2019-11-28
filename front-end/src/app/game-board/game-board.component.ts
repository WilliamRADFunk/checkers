import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Board } from '../models/board';
import { BoardStateService } from '../services/board-state.service';

@Component({
    selector: 'checkers-game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy, OnInit {
    public board: Board;
    public gameOver: boolean;
    public isLoading: boolean = true;
    public subscriptions: Subscription[] = [];

    constructor(private readonly _boardStateService: BoardStateService) { }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s && s.unsubscribe());
        this.subscriptions = [];
    }

    ngOnInit() {
        this.subscriptions.push(
            this._boardStateService.currBoardState.pipe(filter(x => !!x)).subscribe(bs => {
                this.board = bs;
            }),
        );
    }
}
