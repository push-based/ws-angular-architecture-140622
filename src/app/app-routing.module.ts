import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'list/:category',
    component: MovieListPageComponent,
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./movie/movie-detail-page/movie-detail-page.module').then(
        (file) => file.MovieDetailPageModule
      ),
  },
  {
    path: 'list/genre/:id',
    loadChildren: () =>
      import('./movie/movie-genre-page/movie-genre-page.module').then(
        (file) => file.MovieGenrePageModule
      ),
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
