import { TestBed } from '@angular/core/testing';

import { MovieStateService } from './movie-state.service';

describe('MovieStateService', () => {
  let service: MovieStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
