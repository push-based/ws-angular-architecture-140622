# Exercise: NgModule best practices

## Smart module structure

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

## Enable lazyloading for all routes

Now that our module structure is in place we can start lazy loading our feature modules.

we start preparing the router config of our feature modules:

- not-found
- movie-list-page

```ts
// not-found-page.module.ts

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
  },
];
```

```ts
// movie-list-page.module.ts

const routes: Routes = [
  {
    path: '',
    component: MovieListPageComponent,
  },
];
```

Now that the feature modules are configured for proper lazyloading, we now can add the missing bits to the `AppRoutingModule`s
root configuration.

```ts
// app-routing.module.ts

{
    path: 'list/:category',
        loadChildren: () => import('./movie/movie-list-page/movie-list-page.module').then(m => m.MovieListPageModule)
},
// Other imports
{
    path: '**',
        loadChildren: () => import('./not-found-page/not-found-page.module').then(m => m.NotFoundPageModule)
},
```

Remove imports from the `AppModule`.

serve the application, you should notice that the bundler now produces two new bundles which resemble the lazyloaded pieces of code
we have configured with our new router configuration.

```shell
Lazy Chunk Files                                           | Names                                        |
default-src_app_movie_movie_module_ts.js                   | movie-movie-list-page-movie-list-page-module |
src_app_movie_movie-list-page_movie-list-page_module_ts.js | movie-movie-list-page-movie-list-page-module |
```

## Setup PreloadStrategy

With the current setup, all lazy-loaded bundles will start loading as soon as you try to visit its route for the first
time.
We can control this behavior by using a `PreloadStrategy`.

Before continuing, make sure you serve the application, open the network tab of your devtools and filter for `js` bundles.

Open the browser at `http://localhost:4200/list/popular`, you should see the `movie-list-page` bundle being downloaded.

Now, navigate to any invalid route and watch how the application will start downloading the `not-found-module` bundle.

Let's try the `PreloadAllModules` preloadingStrategy.

```ts
// app-routing.module.ts

[RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })];
```

After implementing the `PreloadAllModules`, repeat the process from before. You should notice all bundles being downloaded
as soon as the application finished serving the main bundle.

## Bonus: ngx-quicklink preloading strategy

`ngx-quicklink` provides router preloading strategy which automatically downloads the lazy-loaded modules associated with all the visible links on the screen.

Install `ngx-quicklink`.

```bash
npm i ngx-quicklink --save
```

Adjust app module imports and router configuration

```ts
// app.module.ts

[
  QuicklinkModule,
  RouterModule.forRoot([], { preloadingStrategy: QuicklinkStrategy }),
];
```

Serve the application. Now you will see that only bundles for the visible links are downloaded.

## Bonus: SCAM pattern

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
