import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  private boardState: Subject<number[]> = new Subject<number[]>();
  currBoardState: Observable<number[]> = this.boardState.asObservable();

  constructor() { }
}
