import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieImagePipe } from './movie-image.pipe';

@NgModule({
  declarations: [MovieImagePipe],
  imports: [CommonModule],
  exports: [MovieImagePipe],
})
export class MovieImageModule {}
