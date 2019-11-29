import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'checkers-help-screen',
  templateUrl: './help-screen.component.html',
  styleUrls: ['./help-screen.component.scss']
})
export class HelpScreenComponent {
  activePage: number = 1;
  @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly totalPages: number = 6;

  constructor() { }

  public exitHelp(): void {
      this.helpSelected.emit(false);
  }

  public nextPage(): void {
    if (this.activePage >= this.totalPages) {
      return;
    }
    this.activePage++;
  }

  public prevPage(): void {
    if (this.activePage <= 1) {
      return;
    }
    this.activePage--;
  }
}
