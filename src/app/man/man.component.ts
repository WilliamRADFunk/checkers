import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'checkers-man',
	templateUrl: './man.component.html',
	styleUrls: ['./man.component.scss']
})
export class ManComponent implements OnInit {
	@Input() player: string;

	constructor() { }

	ngOnInit() {
	}
}
