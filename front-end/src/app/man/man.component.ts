import { Component, Input } from '@angular/core';

import { Cell } from '../models/cell';

@Component({
    selector: 'checkers-man',
    templateUrl: './man.component.html',
    styleUrls: ['./man.component.scss']
})
export class ManComponent {
    @Input() cell: Cell;

    constructor() { }
}
