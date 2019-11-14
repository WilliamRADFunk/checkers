import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CellComponent } from './cell.component';
// import { Cell } from '../models/cell';

describe('CellComponent', () => {
	let component: CellComponent;
	let fixture: ComponentFixture<CellComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NgbModule,
				RouterTestingModule
			],
			declarations: [ CellComponent ]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CellComponent);
		component = fixture.componentInstance;
		component.position = [0, 0];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
