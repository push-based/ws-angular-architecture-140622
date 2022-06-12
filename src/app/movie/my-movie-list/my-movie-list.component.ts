import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-my-movie-list',
  templateUrl: './my-movie-list.component.html',
  styleUrls: ['./my-movie-list.component.scss'],
})
export class MyMovieListComponent {
  myMovieForm = new FormGroup({
    title: new FormControl(''),
    comment: new FormControl(''),
  });
  myMovies = this.movieService.getFavorites();

  constructor(private movieService: MovieService) {}
  add(): void {
    this.movieService.upsertFavorite(this.myMovieForm.value);
    this.reset();
    this.myMovies = this.movieService.getFavorites();
  }

  reset(): void {
    this.myMovieForm.reset({
      title: '',
      comment: '',
    });
  }
}
