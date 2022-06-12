import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map, Subject } from 'rxjs';
import { MovieService } from '../movie/movie.service';
import { TMDBMovieGenreModel } from '../shared/model/movie-genre.model';
import { RxState } from '@rx-angular/state';

interface AppShellState {
  sideDrawerOpen: boolean;
  genres: TMDBMovieGenreModel[];
  searchValue: string;
}

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  providers: [RxState],
})
export class AppShellComponent implements OnInit {
  sideDrawerOpen = false;
  viewModel$ = this.state.select();
  readonly genres$ = this.movieService.getGenres();
  readonly searchValue$ = new Subject<string>();
  readonly sideDrawerOpen$ = new Subject<boolean>();
  constructor(
    private movieService: MovieService,
    private state: RxState<AppShellState>,
    private router: Router
  ) {
    this.state.set({
      genres: [],
      sideDrawerOpen: false,
      searchValue: '',
    });
  }

  ngOnInit() {
    const sideDrawerOnNavigation$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      distinctUntilChanged(),
      map(() => false)
    );

    this.state.connect('genres', this.genres$);
    this.state.connect('searchValue', this.searchValue$);
    this.state.connect('sideDrawerOpen', this.sideDrawerOpen$);
    this.state.connect('sideDrawerOpen', sideDrawerOnNavigation$);

    this.state.hold(this.searchValue$, (searchValue) =>
      this.navToSearch(searchValue)
    );
  }

  private navToSearch(value: string) {
    this.router.navigate(['search', value]);
  }
}
