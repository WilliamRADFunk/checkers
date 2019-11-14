import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManComponent } from './man.component';

describe('ManComponent', () => {
	let component: ManComponent;
	let fixture: ComponentFixture<ManComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ManComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
