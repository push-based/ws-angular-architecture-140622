import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMovieListComponent } from './my-movie-list.component';

describe('MyMovieListComponent', () => {
  let component: MyMovieListComponent;
  let fixture: ComponentFixture<MyMovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMovieListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
