import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CellComponent } from './cell.component';
import { BoardHandlerService } from '../services/board-handler.service';
import { Cell } from '../models/cell';

describe('CellComponent', () => {
	let component: CellComponent;
	let fixture: ComponentFixture<CellComponent>;
	let boardHandlerService: BoardHandlerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
            imports: [
				RouterTestingModule
			],
			declarations: [CellComponent],
			providers: [
				BoardHandlerService
			]
		}).compileComponents();
		boardHandlerService = TestBed.get(BoardHandlerService);
	}));

	beforeEach(() => {
		const cell: Cell = {
            flagValues: [],
            immutable: false,
			isClue: false,
			position: [0, 0, 0],
			userAssignedValue: null,
			value: null
		};
		spyOn(boardHandlerService, 'getCell').and.returnValue(cell);
		fixture = TestBed.createComponent(CellComponent);
		component = fixture.componentInstance;
		component.position = [0, 0, 0];
		component.reveal = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
