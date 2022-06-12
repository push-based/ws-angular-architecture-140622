# Exercise: Router Params & LazyLoading

## Setup router params

we want to make our list route more dynamic to switch between different categories of movies we want to display

```ts
// movie-list-page.module.ts
{
    path: 'list/:category',
    component: MovieListPageComponent
}
```

## Enable Category Navigation

go to `AppShellComponent`, use `routerLink` and setup routes to navigate between
`top_rated`, `popular`, `upcoming` movies.

```html
<!-- app-shell.component.html -->
<h3 class="navigation--headline">Discover</h3>
<a
  class="navigation--link"
  [routerLink]="['/list', 'popular']"
  routerLinkActive="active"
>
  <div class="navigation--menu-item">
    <svg-icon class="navigation--menu-item-icon" name="popular"></svg-icon>
    Popular
  </div>
</a>
<a
  class="navigation--link"
  [routerLink]="['/list', 'top_rated']"
  routerLinkActive="active"
>
  <div class="navigation--menu-item">
    <svg-icon class="navigation--menu-item-icon" name="top_rated"></svg-icon>
    Top Rated
  </div>
</a>
<a
  class="navigation--link"
  [routerLink]="['/list', 'upcoming']"
  routerLinkActive="active"
>
  <div class="navigation--menu-item">
    <svg-icon class="navigation--menu-item-icon" name="upcoming"></svg-icon>
    Upcoming
  </div>
</a>
```

serve the application and navigate between the three different categories. You should see the address bar changing, but
the view isn't changing at all.

## Router Params

We need to adapt our `MovieService` in order fetch different categories

```ts
// movie.service.ts

getMovies(category: string): Observable<{ results: MovieModel[] }> {
    // destruct variables
    return this.httpClient.get<{ results: MovieModel[]}>(
        `${tmdbBaseUrl}/3/movie/${category}`
    );
}

```

use router params in `MovieListPageComponent`

```ts
// movie-list-page.component.ts

movies$: Observable<{ results: MovieModel[]}>;

constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
) {}

ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
        if (params.category) {
            this.movies$ = this.movieService.getMovies(params.category);
        }
    })
}
```

serve the application and navigate between categories again. Now you should see that the list of movies is changing properly
according to the selected category in the route.

Please also observe the network tab in your devtools to see how the http requests are getting fired when you switch between routes

## Enable lazyloading for all routes

Now that our module structure is in place we can start lazy loading our feature modules.

we start preparing the router config of our feature modules:

- not-found
- movie-list-page

```ts
// not-found.module.ts

const routes: Routes = [
  {
    path: "",
    component: NotFoundComponent,
  },
];
```

```ts
// movie-list-page.module.ts

const routes: Routes = [
  {
    path: "",
    component: MovieListPageComponent,
  },
];
```

Now that the feature modules are configured for proper lazyloading, we now can add the missing bits to the `AppModule`s
root configuration.

```ts
// app.module.ts

{
    path: 'list/:category',
        loadChildren: () => import('./movie/movie-list-page/movie-list-page.module').then(m => m.MovieListPageModule)
},
{
    path: '**',
        loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
},
```

serve the application, you should notice that the bundler now produces two new bundles which resemble the lazyloaded pieces of code
we have configured with our new router configuration.

```shell
Lazy Chunk Files                                                                 | Names         |      Size
projects_movies_src_app_movie_movie-list-page_movie-list-page_module_ts.js       | -             |   6.95 kB
projects_movies_src_app_not-found_not-found_module_ts.js                         | -             |   6.06 kB
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
// app.module.ts

[RouterModule.forRoot([], { preloadingStrategy: PreloadAllModules })];
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
