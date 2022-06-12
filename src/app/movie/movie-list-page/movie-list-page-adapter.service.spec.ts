import { TestBed } from '@angular/core/testing';

import { MovieListPageAdapterService } from './movie-list-page-adapter.service';

describe('MovieListPageAdapterService', () => {
  let service: MovieListPageAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieListPageAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
