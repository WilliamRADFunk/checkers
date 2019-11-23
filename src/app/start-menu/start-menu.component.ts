import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'checkers-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
    activeOpponent: string = 'Local Human';
    @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() opponentSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() startSelected: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    enterHelp() {
        this.helpSelected.emit(true);
    }

    getTooltipMsg(choice: number): string {
        switch (choice) {
            case 1: {
                return 'Blah';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    opponentChange(choice: string): void {
        this.activeOpponent = choice;
    }

    startGame(): void {
        this.startSelected.emit();
    }

}
