import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'checkers-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
    @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() startSelected: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    enterHelp() {
        this.helpSelected.emit(true);
    }

    getTooltipMsg(num: number): string {
        switch (num) {
            case 1: {
                return 'Blah';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    startGame(): void {
        this.startSelected.emit();
    }

}
