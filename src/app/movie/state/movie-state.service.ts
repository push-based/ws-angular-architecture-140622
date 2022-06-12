import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { map, merge, Observable, Subject, switchAll } from 'rxjs';
import { TMDBMovieModel } from 'src/app/shared/model/movie.model';
import { MovieService } from '../movie.service';

interface MovieState {
  movies: TMDBMovieModel[];
}

@Injectable({
  providedIn: 'root',
})
export class MovieStateService extends RxState<MovieState> {
  private readonly loadCategory$ = new Subject<string>();
  private readonly loadGenre$ = new Subject<string>();

  readonly movies$: Observable<TMDBMovieModel[]> = this.select('movies');

  constructor(private movieService: MovieService) {
    super();

    this.connectState();
  }

  private connectState(): void {
    const categoryMovies$$ = this.loadCategory$.pipe(
      map((category) => this.movieService.getMovieByCategory(category))
    );

    const genreMovies$$ = this.loadGenre$.pipe(
      map((genre) => this.movieService.getMoviesByGenre(parseInt(genre)))
    );

    const movies$ = merge(categoryMovies$$, genreMovies$$).pipe(switchAll());
    this.connect('movies', movies$);
  }

  loadCategory(category: string): void {
    this.loadCategory$.next(category);
  }

  loadGenre(genre: string): void {
    this.loadGenre$.next(genre);
  }
}
