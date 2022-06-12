import { TestBed } from '@angular/core/testing';

import { ReadAccessInterceptor } from './read-access.interceptor';

describe('ReadAccessInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReadAccessInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ReadAccessInterceptor = TestBed.inject(ReadAccessInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
