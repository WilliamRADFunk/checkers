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

    getTooltipMsg(choice: string): string {
        switch (choice) {
            case 'Local Human': {
                return 'Play with a friend, taking turns on the same device.';
            }
            case 'AI': {
                return 'Play against a computer opponent and test your skills at different levels of difficulty.';
            }
            case 'Online Human': {
                return 'Play with another human online, either matched randomly or using a private lounge key.';
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
