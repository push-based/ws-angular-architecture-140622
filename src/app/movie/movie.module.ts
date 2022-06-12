import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from '../ui/pattern/star-rating/star-rating.module';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieImagePipe } from './movie-image.pipe';
import { MovieListComponent } from './movie-list/movie-list.component';

@NgModule({
  declarations: [MovieImagePipe, MovieCardComponent, MovieListComponent],
  imports: [CommonModule, StarRatingModule],
  exports: [MovieListComponent, MovieImagePipe],
})
export class MovieModule {}
