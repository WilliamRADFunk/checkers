import { TestBed } from '@angular/core/testing';

import { BoardStateService } from './board-state.service';

describe('BoardStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardStateService = TestBed.get(BoardStateService);
    expect(service).toBeTruthy();
  });
});
