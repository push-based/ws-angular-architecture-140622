# Global State: GenreState & MovieState

In this exercise we will get to know architectural patterns for decoupling our infrastructure from the view logic.
We will cover basic approaches of decoupling API services from components and sharing access across multiple consumers.
With the help of `@rx-angular/state RxState` we are introducing a better structure for better scalability and maintainability
to our codebase.

## Goal

By the end of this exercise we will have implemented two new services `GenreStateService` & `MovieStateService`, abstracting
away the API logic, providing us better options for component development.

## GenreState

Implement a new service `GenreState` in `movie/state/`.  

<details>
  <summary>Create Service</summary>

```bash
ng g s movie/state/genre-state
```

</details>

Its interface has only one property `genres: TMDBMovieGenreModel[];` 

<details>
  <summary>Interface</summary>

```ts
// genre-state.service.ts

interface GenreState {
  genres: TMDBMovieGenreModel[];
}

```

</details>

The `GenreState` should extend from `RxState` and expose a `genres$: Observable<TMDBMovieGenreModel[]>`

<details>
  <summary>Service Class</summary>

```ts
// genre-state.service.ts

@Injectable({
  providedIn: 'root'
})
export class GenreStateService extends RxState<GenreState> {

  readonly genres$ = this.select('genres');
}

```
</details>

Fill the `genres` data with the data coming from `MovieService` by using the `connect` method of `RxState`

<details>
  <summary>Connect Values</summary>

```ts
// genre-state.service.ts

constructor(private movieService: MovieService) {
  super();
  // instantly connect state, genres are needed immediately they probably won't change
  this.connect('genres', this.movieService.getGenres());
}

```
</details>

Now that our service is in place, we can `connect` the GlobalState to `AppShellComponent`s LocalState and replace the
usage of `MovieService` with the `GenreState`. Connect the `genres` property to the `genreState.genres$` value.

<details>
  <summary>Adjust AppShellComponent</summary>

```ts

constructor(
        private genreState: GenreStateService,
        /* other stuff */
) {}

ngOnInit() {
  /*other stuff*/
  // connect global state to local state
  this.state.connect('genres', this.genreState.genres$);
}

```

</details>

Nice, you have successfully decoupled the TMBD API from the `AppShellComponent` by introducing a stateful global service.

Serve the application and see if the genres are still displayed properly and the network request is valid

```bash
ng serve
```

## MovieState

Our next target for decoupling are actually two components, `MovieListPage` and `GenreListPage`. Taking a look at
those two, you will notice they are actually the very same component. They just interact differently with the
`MovieService`.

The goal is to introduce a stateful global service that handles the business logic for us, providing our components
just with a list of movies to display.
The components should not be aware of the `MovieService` anymore.

Let's start by implementing the `MovieStateService`.

### MovieState Service

Create a new Service `MovieStateService` in `state/movie/`.

<details>
  <summary>Create Service</summary>

```bash
ng g s movie/state/movie-state
```

</details>

For now, the `MovieStateService` only maintains a single state property, `movies: TMDBMovieModel[]`.

<details>
  <summary>State Interface</summary>

```ts
// movie-state.service.ts

interface MovieState {
    movies: TMDBMovieModel[];
}
```

</details>

It should extend from `RxState` and expose a `movies$: Observable<TMDBMovieModel[]>`.
Use the `select` method in order to expose the state property.

<details>
  <summary>MovieStateService Scaffold</summary>

```ts
// movie-state.service.ts

@Injectable({
    providedIn: 'root',
})
export class MovieStateService extends RxState<MovieState> {
    
    readonly movies$: Observable<TMDBMovieModel[]> = this.select('movies');
    
    constructor(private movieService: MovieService) {
        super();
    }
}
```

</details>

The MovieStateService in comparison to the GenreStateService won't fetch the data strait away, instead we actually want
to interact with the service to manipulate the state from the consumer side, we need to think about a public API surface.

The service should be able to serve the `GenreListPage` as well as the `MovieListPage`. So we need two triggers in order 
to fetch a genre list or a category list.

Let's introduce two private trigger subjects and two public methods for the consumer side.
* `loadCategory$: Subject<string>`
* `loadCategory(category: string): void` => next the subject with the value
* `loadGenre$: Subject<string>`
* `loadGenre(genre: string): void` => next the subject with the value

<details>
    <summary>MovieStateService</summary>

```ts
// movie-state.service

private readonly loadCategory$ = new Subject<string>();
private readonly loadGenre$ = new Subject<string>();

loadCategory(category: string): void {
    this.loadCategory$.next(category);
}

loadGenre(genre: string): void {
    this.loadGenre$.next(genre);
}

```

</details>

Finally, we want to use our triggers to connect our actual `movie` state property.
The service react to each of the triggers, resulting in an interaction with the `MovieService` based on the trigger.
Whenever a new trigger was fired, the service should cancel any ongoing request and instead start the new one.
Any result from the `MovieService` should be stored into the `movies` state property.

As a hint, you probably want to `merge` two streams, each emitting the http request to the respective endpoint, resulting
in the `movies: TMDBMovieModel[]`.

The general concept is to create a stream starting from the `trigger`, `map`ping into the `movieService.getMovieByxY` call.

Links:
* [`merge`](https://rxjs.dev/api/index/function/merge)
* [`switchMap`](https://rxjs.dev/api/index/function/switchMap)
* [`switchAll`](https://rxjs.dev/api/index/function/switchAll)


For the sake of readability, please go into the `MovieService` and introduce a new function
`getMovieByCategory(category: string): Observable<TMBDMovieModel[]>`

```ts
// movie-service.ts

getMovieByCategory(category: string): Observable<TMDBMovieModel[]> {
    const { tmdbBaseUrl: baseUrl } = environment;

    return this.httpClient
      .get<{ results: TMDBMovieModel[] }>(`${baseUrl}/3/movie/${category}`)
      .pipe(map(({ results }) => results));
}
```

<details>
    <summary>Create Streams From Trigger</summary>

```ts
// movie-state.service.ts

// in constructor, or create a function for it

// returns a stream of http calls to `/category` endpoint => higher order observable
const categoryMovies$$ = this.loadCategory$.pipe(
  map((category) => this.movieService.getMovieByCategory(category))
);

// returns a stream of http calls to `/genre` endpoint => higher order observable
const genreMovies$$ = this.loadGenre$.pipe(
  map((genre) => this.movieService.getMoviesByGenre(parseInt(genre)))
);

```

</details>

<details>
    <summary>Merge and SwitchMap Streams</summary>

```ts
// movie-state.service.ts

// in constructor, or create a function for it

// merge: combine all streams together into one result
// switchAll: subscribe to the stream, whenever a new call was triggered, cancel the old one
const movies$ = merge(categoryMovies$$, genreMovies$$).pipe(switchAll());
```

</details>

<details>
    <summary>Full Solution</summary>

```ts
// movie-state.service.ts

constructor(private movieService: MovieService) {
    super();
    this.connectState();
}

private connectState(): void {
    const categoryMovies$$ = this.loadCategory$.pipe(
        map((category) => this.movieService.getMovieByCategory(category))
    );
    
    const genreMovies$$ = this.loadGenre$.pipe(
        map((genre) => this.movieService.getMoviesByGenre(parseInt(genre)))
    );
    
    const movies$ = merge(categoryMovies$$, genreMovies$$).pipe(switchAll());
    this.connect('movies', movies$);
}
```

</details>

The implementation for the service is done, congratulations.

Let's head to our `MovieListPageComponent` & `MovieGenrePageComponent` to make use of the global state service.

#### MovieListPageComponent

Remove the dependency to `MovieService` and replace it with `MovieStateService`.  
Replace the `movies$` property to instead just return `movieState.movies$`.

Finally, adjust the `ngOnInit` method and call `movieState.loadCategory(params.category)` instead of assigning the `movies$`
property.

<details>
    <summary>MovieListPageComponent</summary>

```ts
// movie-list-page.component.ts

movies$ = this.movieState.movies$;

constructor(
    private activatedRoute: ActivatedRoute,
    private movieState: MovieStateService
) {}

ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
        this.movieState.loadCategory(params.category);
    });
}
```

</details>

You maybe need to do adjustments to the template as well. The `movies$` property won't return an object with `results`.

<details>
    <summary>MovieListPageComponent Template</summary>

```html

<ng-container *ngIf="(movies$ | async) as movieResponse; else: loader">

  <movie-list
    *ngIf="movieResponse?.length > 0; else: elseTmpl"
    [movies]="$any(movieResponse)">
<!--   $any because movie-list expects the outdated MovieModel   -->
  </movie-list>

</ng-container>

```

</details>

#### Bonus: Adjust MovieGenrePageComponent

Use the `MovieState` in `MovieGenrePageComponent` and replace the `MovieService` occurrence from it. 
