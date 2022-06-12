import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from '../ui/pattern/star-rating/star-rating.module';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieCardModule } from './movie-card/movie-card.module';
import { MovieImageModule } from './movie-image/movie-image.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [CommonModule, MovieCardModule, MovieImageModule, StarRatingModule],
  exports: [MovieListComponent],
})
export class MovieModule {}
