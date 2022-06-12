# Reactive Forms - My Movies

In this exercise we want to deepen our knowledge about `@angular/forms`
and make use of the `ReactiveFormsModule`.

## Goal

At the end of this exercise we want to have a dedicated `MyMovieListComponent`
providing a form to enter movie data.
The form data will help us to maintain a user based list of favorite movies.
On form submission we want to send the data to a mocked service to simulate a dedicated data storage.

## Setup MyMovieListComponent

Create a new module `MyMovieListModule` & component `MyMovieListComponent`

The module should have a routing configuration for displaying
the `MyMovieListComponent` on `''` path.

<details>
<summary> Show Solution </summary>

```bash
# create module
ng g m movie/my-movie-list

# create component
ng g c movie/my-movie-list
```

implement `MyMovieListModule`

```ts
// movie/my-movie-list/my-movie-list.module.ts

const routes: Routes = [
  {
    path: '',
    component: MyMovieListComponent,
  },
];

@NgModule({
    declarations: [MyMovieListComponent],
    imports: [MovieModule, RouterModule.forChild(routes)],
})
export class MyMovieListModule {}
```

</details>

Don't forget add the routing configuration in the `AppModule`.
We want to lazy load the `MyMovieListModule` on the path `my-movies`.

<details>
<summary> add router config </summary>

```ts
// app-routing.module.ts
{
    path: 'my-movies',
    loadChildren: () =>
        import('./movie/my-movie-list/my-movie-list.module').then(
            (file) => file.MyMovieListModule
        ),
},
```

</details>

Now we can implement the `MyMovieListComponent` itself and create our first reactive form.

Start with implementing a `FormGroup` with two `FormControls` for `title` and `comment`. We will add more fields later on.
Also implement a `reset` method which should reset the `FormGroup` to its default value:
```ts
{
  title: '', 
  comment: '',
}
```

Finally, implement a `save` method which should read the current value from the `FormGroup` and call the `reset` method afterwards
to clean up the form after submission.
Start by `console.log` the value. We will add more functionality afterwards. 

<details>
    <summary>Component</summary>

```ts
// my-movie-list.component.ts

myMovieForm = new FormGroup({
    title: new FormControl(''),
    comment: new FormControl(''),
});

add(): void {
    console.log(this.myMovieForm.value, 'movieToStore');
    this.reset();
}

reset(): void {
    this.myMovieForm.reset({
        title: '',
        comment: '',
    });
}

```

</details>

When implementing the template, consider the following things:

Bind the `formGroup` and the `ngSubmit` method:  
`form [formGroup]="myMovieForm" (ngSubmit)="add()"`

Have an input for the `title` control, use `formControlName` directive:  
`input formControlName="title"`

Have a textarea for the `comment` control, use `formControlName` directive:  
`textarea formControlName="comment"`

Have at least one button, if you go for two, mark the one as `submit` and the other as `button`:

`<button class="btn primary-button" type="submit">Save</button>`
`<button class="btn" type="button" (click)="reset()">Reset</button>`

<details>
    <summary>Template</summary>

```html
<!-- my-movie-list.component.html -->
<form [formGroup]="myMovieForm" (ngSubmit)="add()">
    <div class="form-group">
        <label for="title">Title</label>
        <input id="title" type="text" formControlName="title">
    </div>
    <div class="form-group">
        <label for="comment">Comment</label>
        <textarea rows="5" id="comment" formControlName="comment"></textarea>
    </div>
    <div class="button-group">
        <button class="btn" type="button" (click)="reset()">Reset</button>
        <button class="btn primary-button" type="submit">Save</button>
    </div>
</form>

```

</details>

Finally, add some styles to make the UX a bit more appealing.

<details>
    <summary>Styles</summary>

```scss

/* my-movie-list.component.scss */
:host {
  padding: 0 1rem;
  display: block;
}

form {
  width: 500px;
}

.form-group {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  flex-direction: column;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  button:first-child {
    margin-right: .5rem;
  }
}

```

</details>

You can serve the application now and test if your form works under the following route:
`http://localhost:4200/my-movies`.

## Add Navigation

We want our users to be able to navigate to the `my-movies` route. Lets add a new entry in our sidebar for it.
Head to the `AppShellComponent`s template and add a new `routerLink` pointing to `my-movies`

<details>
    <summary>Template</summary>

```html
<!-- app-shell.component.html -->

<!-- optional: add navigation headline :) -->
<h3 class="navigation--headline">User Menu</h3>

<a
        class="navigation--link"
        [routerLink]="['/my-movies']"
        routerLinkActive="active"
>
    <div class="navigation--menu-item">
        <svg-icon class="navigation--menu-item-icon" name="account"></svg-icon>
        My Movies
    </div>
</a>
```

</details>

Serve the application, you should be able to navigate to the `my-movies` route via the sidebar now.


## Implement Service Methods

Now it's time to do some stuff with the data we are now able to capture via our implemented form. Let's start with implementing
the needed methods in the `MovieService`.

Since we don't have an actual endpoint, we will use the `localStorage` in order to have at least
some layer of persistence.

Before we begin, please note we need to adjust `MovieModel` in some way in order to store the `comment` property.
You can decide on your own how to handle it, the solution proposes the most simple approach by adding the needed 
properties on the fly.

Implement the methods following methods in `MovieService`:

* `getFavorites(): (MovieModel & { comment: string})[]` 
* `upsertFavorite(movie: MovieModel & { comment: string })`

The `getFavorites()` method should simple return a `JSON.parsed` value from `localStorage.getItem('my-movies')` or an empty
array in case of no value exists.

The `upsertFavorite` method should take care of adding and/or updating (we get to this later) the given `Movie` and store the
updated array via `localStorage.setItem('my-movies')`.

For the sake of simplicity, please use the helper function `upsert` from `@rx-angular/cdk/transformations`.
For comparison, for now we relate on the `title` property.

```ts
upsert(this.getFavorites(), movie, 'title')
```

<details>
    <summary>MovieService</summary>
    
```ts
// movie.service.ts

getFavorites(): (MovieModel & { comment: string })[] {
    return JSON.parse(localStorage.getItem('my-movies')) || [];
}

upsertFavorite(movie: MovieModel & { comment: string }) {
    const favorites = upsert(this.getFavorites(), movie, 'title');
    localStorage.setItem('my-movies', JSON.stringify(favorites));
}
```
</details>

## Fetch Favorite Movies from Service

Heading back to the `MyMovieListComponent` we can now use the `MovieService`s data in order to display a list of movies.

Create a local variable `myMovies` and assign it to `MovieService#getFavorites()`.
On form submission (`add()`), instead of `console.log` the value, send it to the `upsertFavorite()` method and re-assign
the `myMovies` property to the latest value of `MovieService#getFavorites()`.

<details>
    <summary>MyMovieListComponent</summary>

```ts
// my-movie-list.component.ts

myMovies = this.movieService.getFavorites();

add(): void {
    this.movieService.upsertFavorite(this.myMovieForm.value);
    this.reset();
    this.myMovies = this.movieService.getFavorites();
}

```

</details>

Now create the template to display the list of favorite movies.

Create a `div.my-movies-list`. Inside, use an `*ngFor` to create a `div.movie-item` by iterating over `myMovies`.

<details>
    <summary>Template</summary>

```html
<!-- my-movie-list.component.html -->
<h2>My Movies</h2>
<div class="my-movies-list">
  <div class="movie-item" *ngFor="let movie of myMovies">
    <span class="movie-title">{{ movie.title }}</span>
    <span class="movie-comment">{{ movie.comment }}</span>
  </div>
</div>

```

</details>

Finally, add the styles to improve the UX.

<details>
    <summary>Styles</summary>

```scss
/* my-movie-list.component.scss */

.movie-item {
  padding: 1rem 0.5rem;
  display: flex;
  font-size: var(--text-lg);
  align-items: center;
  
  .btn {
    overflow: hidden;
  }
}

.movie-title {
  width: 125px;
}

```

</details>

That's it, you have successfully created your first `ReactiveForm` with data persistence.
Serve the application and test the functionality.

## Bonus: Implement deletion

add a `delete` button to the template per `myMovies` entry and find a way to delete a movie from the list again.
You can use the `remove()` utility function from `@rx-angular/cdk/transformations` to handle the removal logic for you.

```ts
remove(favorites, { title: 'movie-to-delete' }, 'title');
```

<details>
    <summary>Template suggestion</summary>

```html
<button class="btn btn__icon">
  <svg-icon name="delete"></svg-icon>
</button>
```
</details>
