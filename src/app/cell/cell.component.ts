import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Cell } from '../models/cell';
import { Subscription } from 'rxjs';

@Component({
  selector: 'checkers-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnDestroy, OnInit {
  cell: Cell;
  gameOver: boolean;
  @Input() position: [number, number, number];
  @Input() boardRegistryIndex: number;
  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s && s.unsubscribe());
    this.subscriptions = [];
  }

  ngOnInit() { }

  cellClicked() { }

  @HostListener('mouseover') onHover() {
    console.log('mouseover');
  }

  @HostListener('mouseleave') onLeave() {
    console.log('mouseleave');
  }
}
