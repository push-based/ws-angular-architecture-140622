import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { TMDBMovieModel } from 'src/app/shared/model/movie.model';
import { MovieStateService } from '../state/movie-state.service';

interface MovieListAdapterState {
  movies: TMDBMovieModel[];
}

@Injectable()
export class MovieListPageAdapterService extends RxState<MovieListAdapterState> {
  movies$ = this.select('movies');

  constructor(
    private movieState: MovieStateService,
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.connect('movies', movieState.movies$);
    // constructor or create a function for it
    this.hold(this.activatedRoute.params, (params) => {
      // load category or genre based on the route type
      if (params.type === 'category') {
        this.movieState.loadCategory(params.identifier);
      } else {
        this.movieState.loadGenre(params.identifier);
      }
    });
  }
}
