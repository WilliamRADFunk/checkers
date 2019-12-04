import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Cell } from '../models/cell';

@Component({
    selector: 'checkers-man',
    templateUrl: './man.component.html',
    styleUrls: ['./man.component.scss'],
    animations: [
        trigger('fadein', [
            state('stateName', style({
                visibility: 'visible',
                opacity: 1,
                transition: 'opacity 4s linear'
            })),
            transition('initial=>final', animate('1500ms')),
            transition('final=>initial', animate('1000ms'))
        ])
    ]
})
export class ManComponent implements OnChanges, OnInit {
    @Input() cell: Cell;
    currentState = 'initial';

    constructor() { }

    ngOnInit() {
        if (this.cell.value) {
            this.changeState();
        }
    }

    ngOnChanges(e) {

    }

    changeState() {
        this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    }
}
