import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMovieListComponent } from './my-movie-list.component';
import { Routes, RouterModule } from '@angular/router';
import { MovieModule } from '../movie.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MyMovieListComponent,
  },
];

@NgModule({
  declarations: [MyMovieListComponent],
  imports: [
    MovieModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class MyMovieListModule {}
