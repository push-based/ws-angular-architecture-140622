import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MovieModule } from '../movie.module';
import { MovieGenrePageComponent } from './movie-genre-page.component';

const routes: Routes = [
  {
    path: '',
    component: MovieGenrePageComponent,
  },
];

@NgModule({
  declarations: [MovieGenrePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MovieModule],
})
export class MovieGenrePageModule {}
