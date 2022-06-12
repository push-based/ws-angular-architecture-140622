# Global State: Adapter Pattern

In this exercise we will get to know advanced architectural patterns gluing LocalState and GlobalState together to 
ultimately decouple any state management logic from the component.

## Goal

By the end of this exercise we will have combined `MovieListPageComponent` & `MovieGenrePageComponent` resulting in a single
component displaying a list of movies based on the route.
Furthermore, we remove every piece of non-ui related logic from the `MovieListPageComponent`.
In order to achieve that, we will implement a locally provided `MovieListPageAdapter` for the `MovieListPageComponent`, serving as a
`proxy` for the GlobalState.

Doing this will enable us to remove the `MovieGenrePageComponent` entirely and handle everything in a cohesive service.

Let's start with adjusting the routing configuration in order to be able to derive the movies to be shown from the route.

## Adjust Routing

We want to have a single route configuration pointing to the `MovieListPageComponent`.
The route configuration needs two parameters, one for the `type` ('category' | 'genre') and one for the `identifier` ('id').

Go to the `app-routing.module.ts` and adjust the `list/:category` route so that it has two parameters described above.

After that you should **remove** the config for `list/genre` and also adjust the default route pointing to `list/category/popular`

<details>
    <summary>Router Config solution</summary>

```ts
// app-routing.module.ts

{
    path: 'list/:type/:identifier', // the former list/:category
        loadChildren: () =>
    import('./movie/movie-list-page/movie-list-page.module').then(
        (m) => m.MovieListPageModule
    ),
},

```

</details>

Okay, the router config is in place. We just need to adjust the `routerLink` directives in `app-shell.component.html`
in order to use the new pattern.

Change the routerLinks from `'/list', 'popular'` to `'/list', 'category', 'popular'`

<details>
    <summary>Adjust routerLinks</summary>

```html

[routerLink]="['/list', 'category', 'popular']"

[routerLink]="['/list', 'category', 'top_rated']"

[routerLink]="['/list', 'category', 'upcoming']"
```

</details>

Now we are safe to build our adapter Service.

## MovieListPageAdapter

The `MovieListPageAdapter` should serve as a proxy for the `MovieListPageComponent` to consume pieces of the global state.
Create a service `MovieListPageAdapter`(Service). Since this service is meant to be locally provided and serving only
one component as adapter, move it next to the `movie-list-page.component.ts`.

<details>
    <summary>Generate Service</summary>

```bash
ng g s movie/movie-list-page/movie-list-page-adapter
```

</details>

The Service should define a local interface with one property for `movies: TMDBMovieModel[];`

<details>
    <summary>MovieListAdapterState</summary>

```ts
// movie-list-page-adapter.service.ts

interface MovieListAdapterState {
    movies: TMDBMovieModel[];
}
```

</details>

Since this should be locally provided service, make sure to not provide it in `root`.
It should extend from `RxState` and expose `movie$: Observable<TMDBMovieModel[]>` as a public property.

<details>
    <summary>MovieListPageAdapter Scaffold</summary>

```ts
// movie-list-page-adapter.service.ts

@Injectable()
export class MovieListPageAdapterService extends RxState<MovieAdapterState> {
    movies$ = this.select('movies');
}

```

</details>

Now we can fill our state with values and manage side effects.
Connecting the state is as simple as calling the `connect()` method in order to fill `movies` with `MovieService#movies$`.

Make sure to inject the `MovieService` into your services' constructor.

<details>
    <summary>Connect State</summary>

```ts

constructor(
    private movieState: MovieStateService,
    /* */
  ) {
    super();
    // connect state
    this.connect('movies', movieState.movies$);
  }

```

</details>

The final part to finish the functionality for our service is to determine what movies to load and interact with the `MovieState`
to start the correct data.

We need to combine the logic we already have in place in `MovieListPageComponent` and `MovieGenrePageComponent` by determining
the correct action from the routes `type` parameter.

Since this is a local service, you have access to everything you would have in your component as well.
Your task is now to `hold` a side effect which is triggered by `ActivatedRoute#params`. From the `type` parameter, decide
what action to perform on `movieState` and hand over the `identifier` param.

<details>
    <summary>Load Movie Side Effect</summary>

```ts
// movie-list-page-adapter.service.ts

constructor(
    private movieState: MovieStateService,
    private activatedRoute: ActivatedRoute
) {
    
    // constructor or create a function for it
    this.hold(this.activatedRoute.params, (params) => {
        // load category or genre based on the route type
        if (params.type === 'category') {
            this.movieState.loadCategory(params.identifier);
        } else {
            this.movieState.loadGenre(params.identifier);
        }
    });   
}
```

</details>



## Provide & Use Adapter

The final step of our refactoring is to use the `MovieListPageAdapter` in the `MovieListPageComponent`.

Go to the `MovieListPageComponent` and add `MovieListPageAdapter` to the `provider` array.

Inject it into the constructor and assign the local `movies$` to `adapter.movies$`.

You can safely remove any typescript code not connected to the `adapter`.

<details>
    <summary>MovieListPageComponent</summary>

```ts
// movie-list-page.component.ts

@Component({
    selector: 'movie-list-page',
    templateUrl: './movie-list-page.component.html',
    styleUrls: ['./movie-list-page.component.scss'],
    providers: [MovieListPageAdapterService],
})
export class MovieListPageComponent {
    movies$ = this.adapter.movies$;
    
    constructor(
        private adapter: MovieListPageAdapterService
    ) {}
}

```
</details>

Great, the component is beautiful!!!!!! Please serve the application and navigate between categories and genres.

```bash
ng serve
```
