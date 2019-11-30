import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import { CellComponent } from '../cell/cell.component';
import { ManComponent } from '../man/man.component';

describe('GameBoardComponent', () => {
    let component: GameBoardComponent;
    let fixture: ComponentFixture<GameBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GameBoardComponent,
                CellComponent,
                ManComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameBoardComponent);
        component = fixture.componentInstance;
        component.board = {
            cellStates: [],
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});