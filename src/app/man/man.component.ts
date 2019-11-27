import { Component, OnInit, Input } from '@angular/core';

import { Cell } from '../models/cell';

@Component({
    selector: 'checkers-man',
    templateUrl: './man.component.html',
    styleUrls: ['./man.component.scss']
})
export class ManComponent implements OnInit {
    @Input() cell: Cell;

    constructor() { }

    ngOnInit() { }
}
