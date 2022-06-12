import { TestBed } from '@angular/core/testing';

import { GenreStateService } from './genre-state.service';

describe('GenreStateService', () => {
  let service: GenreStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenreStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
