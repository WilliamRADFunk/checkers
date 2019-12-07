import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ManComponent } from './man.component';
import { CellComponent } from '../cell/cell.component';

describe('ManComponent', () => {
    let component: ManComponent;
    let fixture: ComponentFixture<ManComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule,
                RouterTestingModule
            ],
            declarations: [
                ManComponent,
                CellComponent
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManComponent);
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
