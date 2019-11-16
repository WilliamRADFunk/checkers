import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BoardStateService } from './board-state.service';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root'
})
export class MoveTrackerService {
  private _boardState: Cell[][] = [];
  private _clickableCells: Subject<number[]> = new Subject<number[]>();
  currClickableCells: Observable<number[]> = this._clickableCells.asObservable();

  constructor(private readonly _boardStateService: BoardStateService) {
    this._boardStateService.currBoardState.pipe(filter(x => !!x)).subscribe(bs => {
      this._boardState = bs.cellStates;
    })
  }
}
