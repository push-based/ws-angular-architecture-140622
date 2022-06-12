# Exercise: NgModule best practices

## smart module structure

Let's try to distinguish between `shared` and `feature` modules in our movies application.

We consider the following components as `shared`:

- movie-list
- movie-card
- movie-image

Since all of the identified `shared` components are inside of the same domain, we can combine them together
in the already existing `MovieModule` without making any changes to it.

We consider the following components as `feature`:

- movie-list-page
- not-found

For all the feature modules we want to introduce new `NgModules`

start by introducing a `MovieListPageModule`. It should declare the `MovieListPageComponent` and import everything
only this component needs.

`ng g m movie/movie-list-page`

```ts
@NgModule({
  declarations: [MovieListPageComponent],
  imports: [CommonModule, MovieModule],
})
export class MovieListPageModule {}
```

Continue by removing all occurrences of `MovieListPageComponent` from `MovieModule`, `AppRoutingModule` routes configuration.

Finally, we need to re-introduce (or move) the route config to the `MovieListPageModule` **and** import it
in the `AppModule` as we did before with the `MovieModule`.

```ts
// movie-list-page.module.ts

const routes: Routes = [
  {
    path: 'list/:category',
    component: MovieListPageComponent,
  },
];

RouterModule.forChild(routes);
```

We successfully integrated our first feature module!
Serve the application and see if the popular movies are showing up properly.

Continue by repeating this task for the `NotFoundComponent`.

`ng g m not-found-page`

```ts
// not-found-page.module.ts

const routes: Routes = [{
  path: '**',
  component: NotFoundPageComponent
}];

{
    declarations: [NotFoundPageComponent],
    imports: [
      SvgIconModule,
      CommonModule,
      RouterModule.forChild(routes),
    ]
}
```

> don't forget to adapt the `AppModule` & `AppRoutingModule`

after completing the refactoring, serve the application, enter an invalid route and see if the 404 page
shows up.

### SCAM pattern

In order to prevent too heavy modules upfront, we want to make use of the so called `SCAM` pattern.
For this we want to refactor all our components to be declared and exported by their very own `NgModule`

This opens up a migration to standalone components in Angular 14.

Generate module for `MovieCardComponent`.

```shell
ng g m movie/movie-card
```

Adjust generated module content to following:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from './movie-card.component';

@NgModule({
  declarations: [MovieCardComponent],
  imports: [CommonModule, StarRatingModule],
  exports: [MovieCardComponent],
})
export class MovieCardModule {}
```

Remove it from `MovieModule` **and** import module instead.

Generate module for `MovieImagePipe`.

```shell
ng g m movie/movie-image
```

Adjust generated module content to following:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieImagePipe } from './movie-image.pipe';

@NgModule({
  declarations: [MovieImagePipe],
  imports: [CommonModule],
  exports: [MovieImagePipe],
})
export class MovieImageModule {}
```

- Import module in `MovieCardModule`.
- Replace `MoveImagePipe` with `MovieImageModule` import in `MovieModule`.
- Add it to `MovieDetailPageModule` as well.
