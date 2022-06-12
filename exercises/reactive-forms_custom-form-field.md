# Reactive Forms - Custom Form Field

As a final step we want to interact with real data and implement a custom form field which handles
the movie search and selection of an entry for us.

## Goal

At the end of this exercise we know how to build custom form fields. Users of our application should be able to maintain their private
lists of favorite movies based on real data provided by the `TMBD Api`.

## Implement Custom Control

Generate a new `MovieSearchControlModule` & `MovieSearchControlComponent`. 

It should replace the current input for `title` and instead serve as an autocomplete control, giving users the ability
to search for a movie and select one from the result.

Provide the `MovieSearchControlComponent` by using the `useExisting` provider as an `NG_VALUE_ACCESSOR` and 
implement the `ControlValueAccessor` interface from `@angular/forms`.

<details>
  <summary>Component Skeleton</summary>

```bash
ng g m movie/movie-search-control

ng g c movie/movie-search-control
```

```ts
// movie-search-control.component.ts

@Component({
  selector: 'app-movie-search-control',
  templateUrl: './movie-search-control.component.html',
  styleUrls: ['./movie-search-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MovieSearchControlComponent,
      multi: true,
    },
  ],
})
export class MovieSearchControlComponent implements ControlValueAccessor {}
```

</details>

The `ControlValueAccessor` forces you to implement
* `writeValue` => receive a value from the outside (e.g. `control.setValue()`), can be typed with `MovieModel`
* `registerOnChange(fn: any)` => callback to call when the user changed the data of the form
* `registerOnTouched(fn: any)` => callback to call when the control was `touched`, usually this is `blur`
* `setDisabledState(isDisabled: boolean)` => we will skip this one

Implement all of those methods, start with implementing `registerOnChange(fn: any)` & `registerOnTouched(fn: any)`.

Your Component should have properties holding a reference to those callbacks:
* `onChange = (movie: MovieModel) => {};`
* `onTouched = () => {};`

In `registerOnChange`, assign the given callback to the local `onChange` method. Do the same for `registerOnTouched`.

<details>
  <summary>ControlValueAccessor implemented</summary>

```ts
// movie-search-control.component.ts

@Component({
  selector: 'app-movie-search-control',
  templateUrl: './movie-search-control.component.html',
  styleUrls: ['./movie-search-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MovieSearchControlComponent,
      multi: true,
    },
  ],
})
export class MovieSearchControlComponent implements ControlValueAccessor {

  onChange = (movie: MovieModel) => {};
  onTouched = () => {};

  constructor() {}

  writeValue(movie: MovieModel) {}

  registerOnChange(fn: any): void {
    this.onChange = fn; // assign the callback to your component
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
```

</details>

Now we can start implementing the business logic for our search.
For this, we want to keep a local `movie$: Observable<MovieModel[]>` to bind the list of movies to the template
as well as a `searchTerm$: Subject<string>` informing us about any changes made from the user to our search input.

Last pre-condition is the `MovieService`, you want to inject it into your components' constructor.

The logic is basically the same as for the `movie-search-list-page.`component.ts`.
Use `switchMap()` in order to switch from the `searchTerm$` to the `movieService.searchMovie()` call to
set up your `movie$` Observable.

In case the searchTerm is empty, return `of(null)` to invalidate the list.


<details>
  <summary>Component Bindings</summary>

```ts
// movie-search-control.component.ts

readonly searchTerm$ = new Subject<string>();

readonly movies$ = this.searchTerm$.pipe(
        switchMap((term) =>
                term ? this.movieService.searchMovies(term) : of(null)
        )
);

constructor(private movieService: MovieService) {}
```

</details>

Now it's time to build our template.
Insert an `input` serving as our searchInput. Bind `(input)` so that it execute the search by calling `searchTerm$.next()`.
On `(blur)` call the `onTouched()` method to set our control into a correct state.

For the results, use the `*ngIf=movies$ | async as movies` hack in order to have the movies variable accessible in the 
template.

Generate a `div.results` as a wrapper div for the results.
Iterate over the `movies` and create `button.movie-result` elements. You probably want to bind the buttons `(click)` event
to the `onChange()` method and provide the current movie as value.

As a body for the `button`, u can use this piece of template:

```html
<img [src]="movie.poster_path | movieImage" width="35" [alt]="movie.title">
<span>{{ movie.title }}</span>
```

<details>
  <summary>Complete Template</summary>

```html
<!-- movie-search-control.component.html -->
<input #searchInput (blur)="onTouched()" (input)="searchTerm$.next(searchInput.value)">
<div class="results" *ngIf="movies$ | async as movies">
  <button class="movie-result"
          (click)="onChange(movie)"
          *ngFor="let movie of movies">
    <img [src]="movie.poster_path | movieImage" width="35" [alt]="movie.title">
    <span>{{ movie.title }}</span>
  </button>
</div>
```
</details>

Finally, add the styles in order to have a more appealing visual experience.

<details>
  <summary>Styles</summary>

```scss

:host {
  display: block;
}

.results {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 350px;
  overflow: auto;
}

.movie-result {
  display: flex;
  align-items: center;
  padding: .5rem 1rem;
}

```

</details>

## Use Custom Component

Great, the custom control is in place. We want to start using it now and see whats left to implement.

Head to the `MyMovieListComponent` and slightly adjust the `FormGroup` setup.

You want to get rid of the `title` field in the add form, replace it with a `movie` field
instead and provide a `nullish` value instead of an empty string.

Also, adjust the validator, it should now compare `ctrl.value?.id` to the `id` of the results coming from `getFavorites()`.

Please also note you have to touch the `reset()` method and create a proper movie object in the `add` method in order
to send the correct set of data to the `createMovieForm` method.

<details>
  <summary>FormGroup adjustments</summary>

```ts

// my-movie-list.component.ts

myMovieForm = new FormGroup({
  movie: new FormControl(null, [
    Validators.required,
    (ctrl) => {
      return !!this.movieService
              .getFavorites()
              .find((favorite) => favorite.id === ctrl.value?.id)
             ? {
                unique: true,
              }
             : null;
    },
  ]),
  comment: new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]),
});

add(): void {
    if (this.myMovieForm.valid) {
      const favorite = {
        ...this.myMovieForm.value.movie,
        comment: this.myMovieForm.value.comment,
      };
      this.favorites.push(this.createMovieForm(favorite));
      this.reset();
    } else {
      this.myMovieForm.markAllAsTouched();
    }
}


reset(): void {
  this.myMovieForm.reset({
    movie: null,
    comment: '',
  });
}

```

</details>

Now, replace the current `input formControlName="title"` with the `app-movie-search-control` component.
Apply the `formControlName="movie"` directive to the component and optionally, adjust the labels contents to
state search instead :).



<details>
  <summary>Template adjustments</summary>

```html
<!-- my-movie-list.component.html -->

<label for="search">Search</label>
<app-movie-search-control id="search" formControlName="movie"></app-movie-search-control>
<span class="error" *ngIf="showError('movie')">
  <ng-container *ngIf="myMovieForm.get('movie').hasError('required'); else: unique">
    Entering a title is required
  </ng-container>
  <ng-template #unique>
    You already added that movie, edit it instead
  </ng-template>
</span>
```

</details>

Serve the application, try out your new custom control! Because some features are still not implemented, try to add
a `console.log` to `this.myMovieForm.valueChanges` to observe if the selection is working.

## React to value changes

You probably have noticed that some functionality is still missing. The result list should be empty after a
value was selected and the `reset` functionality isn't working anymore.

Let's start by emptying our result when selecting a movie. For this, implement a `selectMovie(movie: MovieModel)`
method. You also need to fetch your `searchInput` as an `@ViewChild()` in order to interact with the native control.

The `selectMovie` method should call the `onChange` method with the given value, reset the `searchTerm$` Subject and set
the `nativeElement.value` of the `searchInput` to the movies title property.

<details>
  <summary>selectMovie</summary>

```ts
// movie-search-control.component.ts

 @ViewChild('searchInput')
  searchInput: ElementRef<HTMLInputElement>;

 selectMovie(movie: MovieModel) {
   this.onChange(movie);
   this.searchTerm$.next('');
   this.searchInput.nativeElement.value = movie.title;
 }
```

```html
<!-- movie-search-control.component.ts -->

<button class="movie-result"
        (click)="selectMovie(movie)"
        *ngFor="let movie of movies">
  <img [src]="movie.poster_path | movieImage" width="35" [alt]="movie.title">
  <span>{{ movie.title }}</span>
</button>
```

</details>


Run the application, the result set should now hide and the input show a proper value on user selection.

As a final step, let's make the `reset` method work again. For this we finally need to implement the `writeValue(movie: MovieModel)` 
method.

Inside `writeValue` we want to reset the current `searchTerm$` value and set the `searchInput.nativeElement.value` to
either the movies title or `''` in case a nullish value was provided.

<details>
  <summary>writeValue</summary>

```ts
// movie-search-control.component.ts


writeValue(movie: MovieModel): void {
    // searchInput won't be available for the first emission.
    // if u want to care about initial value of the form, please go ahead and implement some form of cache to set the
    // value right on the afterViewInit hook 
    this.searchInput?.nativeElement?.value = movie ? movie.title : '';
    this.searchTerm$.next('');
}
```
</details>

Well done. Serve the application and see if everything is working as expected. The control
should now be in a usable state :)
