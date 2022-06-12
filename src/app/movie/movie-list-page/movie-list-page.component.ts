import { Component } from '@angular/core';
import { MovieListPageAdapterService } from './movie-list-page-adapter.service';

@Component({
  selector: 'movie-list-page',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  providers: [MovieListPageAdapterService],
})
export class MovieListPageComponent {
  movies$ = this.adapter.movies$;

  constructor(private adapter: MovieListPageAdapterService) {}
}
