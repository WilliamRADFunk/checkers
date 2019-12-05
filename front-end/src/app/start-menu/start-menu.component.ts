import { Component, EventEmitter, Output, OnDestroy, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'checkers-start-menu',
    templateUrl: './start-menu.component.html',
    styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnDestroy, OnInit {
    private _subscriptions: Subscription[] = [];

    activeDifficulty: number = 1;
    activeOnlineMethod: number = 1;
    activeOpponent: string = 'Local Human';
    gameroomCodeProvided: FormControl = new FormControl('');
    @Input() gameroomCode: string;
    @Input() playerNumber: number;

    @Output() difficultySelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() gameroomCodeEntered: EventEmitter<string> = new EventEmitter<string>();
    @Output() helpSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onlineMethodSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() opponentSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() startSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    ngOnDestroy() {
        this._subscriptions.forEach(sub => sub && sub.unsubscribe());
        this._subscriptions.length = 0;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.difficultySelected.emit(1);
            this.opponentSelected.emit(1);
        }, 10);
        this._subscriptions.push(
            this.gameroomCodeProvided.valueChanges.subscribe(value => {
                this.gameroomCodeEntered.emit(value);
            })
        );
    }

    public enterHelp(): void {
        this.helpSelected.emit(true);
    }

    public isColorOptionAvailable(): boolean {
        return (this.activeOpponent === 'AI') || (this.activeOpponent === 'Online Human' && this.activeOnlineMethod === 1);
    }

    public getTooltipDiffMsg(choice: number): string {
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

    public getTooltipMsg(choice: string): string {
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

    public getTooltipOMMsg(choice: number): string {
        switch (choice) {
            case 1: {
                return 'Host a game online with someone you know (give the gameroom code shown below to the other person).';
            }
            case 2: {
                return 'Join a game online with someone you know (enter the code they give you, in the box below, to enter that gameroom).';
            }
            case 3: {
                return 'Be randomly matched with another player online.';
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    public getTooltipStartMsg(choice: number): string {
        switch (choice) {
            case 1: {
                return `Start game as player 1\n(silver team)`;
            }
            case 2: {
                return `Start game as player 2\n(red team)`;
            }
            default: {
                return 'Not a valid option';
            }
        }
    }

    public difficultyChange(choice: number): void {
        this.activeDifficulty = choice;
        this.difficultySelected.emit(choice);
    }

    public onlineMethodChange(choice: number): void {
        this.activeOnlineMethod = choice;
        this.onlineMethodSelected.emit(choice);
    }

    public opponentChange(choice: string): void {
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
                this.onlineMethodChange(1);
                break;
            }
        }
    }

    public startGame(e: number): void {
        this.startSelected.emit(e);
    }
}
