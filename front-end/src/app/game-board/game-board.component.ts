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
    public playerNumber: number;
    private _subscriptions: Subscription[] = [];

    constructor(private readonly _boardStateService: BoardStateService) { }

    ngOnDestroy(): void {
        this._subscriptions.forEach(s => s && s.unsubscribe());
        this._subscriptions = [];
    }

    ngOnInit(): void {
        this._subscriptions.push(
            this._boardStateService.currBoardState.pipe(filter(x => !!x)).subscribe(bs => {
                this.board = bs;
            }),
            this._boardStateService.currPlayerNumber.pipe(filter(x => !!x)).subscribe((pn: number) => {
                this.playerNumber = pn;
            })
        );
    }
}
