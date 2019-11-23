import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'checkers-help-screen',
  templateUrl: './help-screen.component.html',
  styleUrls: ['./help-screen.component.scss']
})
export class HelpScreenComponent {
  activePage: number = 1;
  @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly totalPages: number = 10;

  constructor() { }

  exitHelp() {
      this.helpSelected.emit(false);
  }

  nextPage() {
    if (this.activePage >= this.totalPages) {
      return;
    }
    this.activePage++;
  }

  prevPage() {
    if (this.activePage <= 1) {
      return;
    }
    this.activePage--;
  }
}
