import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { CellComponent } from './cell.component';
import { ManComponent } from '../man/man.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

describe('CellComponent', () => {
    let component: CellComponent;
    let fixture: ComponentFixture<CellComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule,
                RouterTestingModule,
                SocketIoModule.forRoot(config)
            ],
            declarations: [
                CellComponent,
                ManComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CellComponent);
        component = fixture.componentInstance;
        component.cell = {
            id: 0,
            player: 0,
            playerColor: '',
            position: [0, 0],
            value: 0
        };
        component.playerNumber = 1;
        component.style = 0;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
