import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StartMenuComponent } from './start-menu.component';

describe('StartMenuComponent', () => {
  let component: StartMenuComponent;
  let fixture: ComponentFixture<StartMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            NgbModule,
            ReactiveFormsModule
        ],
        declarations: [ StartMenuComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartMenuComponent);
    component = fixture.componentInstance;
    component.gameroomCode = '';
    component.playerNumber = 1;
    component.peoplePlaying = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
