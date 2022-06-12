import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MovieModel } from '../movie-model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'movie-list-page',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
})
export class MovieListPageComponent implements OnInit, OnDestroy {
  movies$?: Observable<{ results: MovieModel[] }>;

  private sub?: Subscription;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.movies$ = this.movieService.getMovieList(params.category);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
