import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from '../ui/pattern/star-rating/star-rating.module';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieImagePipe } from './movie-image.pipe';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieListPageComponent } from './movie-list-page/movie-list-page.component';

@NgModule({
  declarations: [
    MovieImagePipe,
    MovieListPageComponent,
    MovieCardComponent,
    MovieListComponent,
  ],
  imports: [CommonModule, StarRatingModule],
  exports: [MovieListComponent, MovieImagePipe],
})
export class MovieModule {}
