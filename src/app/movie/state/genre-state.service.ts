import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { TMDBMovieGenreModel } from 'src/app/shared/model/movie-genre.model';
import { MovieService } from '../movie.service';

interface GenreState {
  genres: TMDBMovieGenreModel[];
}

@Injectable({
  providedIn: 'root',
})
export class GenreStateService extends RxState<GenreState> {
  readonly genres$ = this.select('genres');

  constructor(private movieService: MovieService) {
    super();
    // instantly connect state, genres are needed immediately they probably won't change
    this.connect('genres', this.movieService.getGenres());
  }
}
