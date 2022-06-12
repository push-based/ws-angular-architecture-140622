import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MovieService } from '../movie/movie.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
  sideDrawerOpen = false;

  readonly genres$ = this.movieService.getGenres();

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd && this.sideDrawerOpen),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.sideDrawerOpen = false;
      });
  }
}
