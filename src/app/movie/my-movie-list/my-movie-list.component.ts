import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-my-movie-list',
  templateUrl: './my-movie-list.component.html',
  styleUrls: ['./my-movie-list.component.scss'],
})
export class MyMovieListComponent {
  myMovieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  myMovies = this.movieService.getFavorites();

  constructor(private movieService: MovieService) {}
  add(): void {
    if (this.myMovieForm.valid) {
      this.movieService.upsertFavorite(this.myMovieForm.value);
      this.reset();
      this.myMovies = this.movieService.getFavorites();
    } else {
      this.myMovieForm.markAllAsTouched();
    }
  }
  showError(controlName: string): boolean {
    const ctrl = this.myMovieForm.get(controlName);
    return !ctrl.valid && ctrl.touched;
  }
  reset(): void {
    this.myMovieForm.reset({
      title: '',
      comment: '',
    });
  }
}
