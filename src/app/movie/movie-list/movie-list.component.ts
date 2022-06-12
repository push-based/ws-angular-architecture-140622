import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieModel } from '../movie-model';

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent {
  @Input() movies?: MovieModel[];

  constructor(private router: Router) {}

  navToDetail(movie: MovieModel): void {
    this.router.navigate(['/movie', movie.id]);
  }
}
