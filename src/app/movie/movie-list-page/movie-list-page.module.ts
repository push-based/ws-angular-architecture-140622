import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MovieModule } from '../movie.module';
import { MovieListPageComponent } from './movie-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: MovieListPageComponent,
  },
];

@NgModule({
  declarations: [MovieListPageComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MovieModule],
})
export class MovieListPageModule {}
