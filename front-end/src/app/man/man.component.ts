import { Component, Input } from '@angular/core';
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
            state('in', style({opacity: 1})),
            // fade in when created. this could also be written as transition('void => *')
            transition(':enter', [ style({opacity: 0}), animate(1000) ]),
            // fade out when destroyed. this could also be written as transition('void => *')
            transition(':leave', animate(1000, style({opacity: 0})))
        ])
    ]
})
export class ManComponent {
    @Input() cell: Cell;
    @Input() playerNumber: number;
    @Input() style: number;

    constructor() {}
}
