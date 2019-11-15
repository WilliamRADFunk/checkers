import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BoardStateService } from './board-state.service';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root'
})
export class MoveTrackerService {
  private boardState: Cell[][] = [];
  private clickableCells: Subject<number[]> = new Subject<number[]>();
  currClickableCells: Observable<number[]> = this.clickableCells.asObservable();

  constructor(private readonly boardState: BoardStateService) {

  }
}
