import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list/:type/:identifier', // the former list/:category
    loadChildren: () =>
      import('./movie/movie-list-page/movie-list-page.module').then(
        (m) => m.MovieListPageModule
      ),
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./movie/movie-detail-page/movie-detail-page.module').then(
        (file) => file.MovieDetailPageModule
      ),
  },
  {
    path: '',
    redirectTo: 'list/category/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadChildren: () =>
      import('./not-found-page/not-found-page.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
