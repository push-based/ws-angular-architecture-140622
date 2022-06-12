import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieGenrePageComponent } from './movie-genre-page.component';

describe('MovieGenrePageComponent', () => {
  let component: MovieGenrePageComponent;
  let fixture: ComponentFixture<MovieGenrePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieGenrePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieGenrePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
