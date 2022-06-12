import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MovieModel } from '../movie-model';
import { MovieStateService } from '../state/movie-state.service';

@Component({
  selector: 'movie-list-page',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
})
export class MovieListPageComponent implements OnInit, OnDestroy {
  movies$?: Observable<{ results: MovieModel[] }>;

  private sub?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieState: MovieStateService
  ) {}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.movieState.loadCategory(params.category);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
