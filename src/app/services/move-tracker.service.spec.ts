import { TestBed } from '@angular/core/testing';

import { MoveTrackerService } from './move-tracker.service';

describe('MoveTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoveTrackerService = TestBed.get(MoveTrackerService);
    expect(service).toBeTruthy();
  });
});
