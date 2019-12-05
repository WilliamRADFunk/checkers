import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { GameBoardComponent } from './game-board.component';
import { CellComponent } from '../cell/cell.component';
import { ManComponent } from '../man/man.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

describe('GameBoardComponent', () => {
    let component: GameBoardComponent;
    let fixture: ComponentFixture<GameBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                SocketIoModule.forRoot(config)
            ],
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
