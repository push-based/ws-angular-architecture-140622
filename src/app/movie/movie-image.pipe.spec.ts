import { MovieImagePipe } from './movie-image/movie-image.pipe';

describe('MovieImagePipe', () => {
  it('create an instance', () => {
    const pipe = new MovieImagePipe();
    expect(pipe).toBeTruthy();
  });
});
