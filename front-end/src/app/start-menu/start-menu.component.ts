import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
    selector: 'checkers-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnInit {
    activeDifficulty: number = 1;
    activeOnlineMethod: number = 1;
    activeOpponent: string = 'Local Human';
    @Output() difficultySelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onlineMethodSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() opponentSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() startSelected: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit() {
        this.difficultySelected.emit(1);
        this.opponentSelected.emit(1);
        this.onlineMethodSelected.emit(1);
    }

    enterHelp() {
        this.helpSelected.emit(true);
    }

    getTooltipDiffMsg(choice: number): string {
        switch (choice) {
            case 1: {
                return 'The AI will be clumsy and prone to the occasional mistake.';
            }
            case 2: {
                return 'The AI won\'t be much of a planner, but it won\'t be complacent.';
            }
            case 3: {
                return 'The AI will be thinking ahead. An experienced human player would be at this level.';
            }
            case 4: {
                return 'The AI will have no mercy. Chance of success against this opponent is small.';
            }
            default: {
                return 'Not a valid option';
            }
        }
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

    getTooltipOMMsg(choice: number): string {
        switch (choice) {
            case 1: {
                return 'Host a game online with someone you know (give the gameroom code to the other person).';
            }
            case 2: {
                return 'Join a game online with someone you know (enter the code they give you to enter that gameroom).';
            }
            case 3: {
                return 'Be randomly matched with another player online.';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    difficultyChange(choice: number): void {
        this.activeDifficulty = choice;
        this.difficultySelected.emit(choice);
    }

    onlineMethodChange(choice: number): void {
        this.activeOnlineMethod = choice;
        this.onlineMethodSelected.emit(choice);
    }

    opponentChange(choice: string): void {
        this.activeOpponent = choice;
        switch (choice) {
            case 'Local Human': {
                this.opponentSelected.emit(1);
                break;
            }
            case 'AI': {
                this.opponentSelected.emit(2);
                break;
            }
            case 'Online Human': {
                this.opponentSelected.emit(3);
                break;
            }
        }
    }

    startGame(): void {
        this.startSelected.emit();
    }

}
