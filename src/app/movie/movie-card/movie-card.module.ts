import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from './movie-card.component';
import { MovieImageModule } from '../movie-image/movie-image.module';
import { StarRatingModule } from 'src/app/ui/pattern/star-rating/star-rating.module';

@NgModule({
  declarations: [MovieCardComponent],
  imports: [CommonModule, StarRatingModule, MovieImageModule],
  exports: [MovieCardComponent],
})
export class MovieCardModule {}
