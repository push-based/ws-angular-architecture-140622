# Reactive Forms - Dynamic Forms

Until now, we just added single entries to a list of items and display them.
Let's add some dynamic to our form so that our users can edit
added items as well instead of just listing them.

## Goal

At the end of this exercise we know how to build dynamic forms with the help of `FormArray`.

## Setup FormArray

Let's start by introducing a `favorites: FormArray` property which should serve as our viewModel to have dynamically
editable favorites.

The initial value of the `FormArray` should be derived from `MovieService#getFavorites()` in order to initially display
what we have stored in our persistence layer.

For each of the `movies` in the store, create a `FormGroup` and add it to the `favorites: FormArray`. You can do that in
onInit or at construct time by assigning it directly to the property itself.

<details>
    <summary>Show Solution</summary>

```ts
//my-movie-list.component.ts


// for easier access to the array
favorites: FormArray = new FormArray(
    this.movieService
        .getFavorites()
        .map((favorite) => this.createMovieForm(favorite))
);

// convenience function for creating a formGroup for a movie
private createMovieForm(movie: MovieModel & { comment: string }): FormGroup {
    return new FormGroup({
        title: new FormControl(movie.title, Validators.required),
        comment: new FormControl(movie.comment, [
            Validators.required,
            Validators.minLength(5),
        ]),
    });
}
```

</details>

Now we can create our `FormGroup` which should hold our `favorites: FormArray` as control.

<details>
    <summary>Show solution</summary>

```ts

favoritesForm = new FormGroup({ favorites: this.favorites });

```
</details>

This should serve already as a basis to keep track of each movies changes via user inputs. Let's head over to the
template and apply some changes to display an actual form.

* Bind the `favoritesForm: FormGroup` to the `div.my-movies-list` which than serves as form container for us
* Create an `ng-container formArrayName="favorites"` as a wrapper around the `div.movie-item *ngFor` construct
* stop iterating over `myMovies`, instead iterate over `let movieCtrl of favorites.controls`
* apply the `movieCtrl` to a `[formGroup]` directive placed on the `div.movie-item`
* instead of reading `movie.title`, change the value binding so that you read the value from `movieCtrl.get('title')`
  * alternative: you can also create an `input readonly` and use the `formControlName="title"` directive
* create a `div.form-group` for the `textarea` for the comments, apply the `formControlName="comment"` directive to it

<details>
    <summary>Show Solution</summary>


```html
<!-- my-movie-list.component.html -->

<!-- FormGroup binding -->
<div class="my-movies-list" [formGroup]="favoritesForm">
    <!-- FormArray binding -->
  <ng-container formArrayName="favorites">
      <!-- FormGroup (array items) binding -->
    <div class="movie-item" *ngFor="let movieCtrl of favorites.controls;"
      [formGroup]="$any(movieCtrl)">
        <!-- FormControl bindings -->
      <span class="movie-title">{{ movieCtrl.get('title').value }}</span>
      <div class="form-group">
        <textarea formControlName="comment"
                  class="movie-comment"></textarea>
      </div>
      <button class="btn btn__icon">
        <svg-icon name="delete" ...></svg-icon>
      </button>
    </div>
  </ng-container>
</div>
```
</details>

Run the application and see if the dynamic form is working with the current set of data.
Since you cannot dynamically add new items to the FormArray, you need to refresh the page after saving a new entry. It will still be stored in the localStorage.

## Dynamic FormGroups

Now we want our users to be able to dynamically add new movie forms on the fly and also store
updates in the localstorage.

Start by implement a `setFavorites(movies: (MovieModel & { comment: string })[])` method in the `MovieService`.
It should take an array of `MovieModel & { comment: string }` and `JSON.stringify` it into the `localStorage`.

<details>
    <summary>Show solution</summary>

```ts
// movie.service.ts

setFavorites(movies: (MovieModel & { comment: string })[]) {
    localStorage.setItem('my-movies', JSON.stringify(movies));
}
```
</details>

Now that our update method is in place, we can move on to the `MyMovieListComponent` and connect the form updates
to it.

Subscribe to `this.favorites.valueChanges` and call the `MovieService#setFavorites` with the current value of the form.

<details>
    <summary>Show solution</summary>

```ts
// my-movie-list.component.ts


ngOnInit(): void {
    this.favorites.valueChanges
      .subscribe(() => {
        this.movieService.setFavorites(this.favorites.value);
      });
}
```

</details>

Serve the application and update any movie you have listed. Open the dev tools and see how the data is written into your
local storage.

You will notice that even invalid data will be added to the local storage. If you want to only insert valid updates,
use the `.pipe(filter(() => this.favorites.valid))` in order to suppress valueChanges that are invalid.

We are still missing methods for adding and removing items to and from the `FormArray`, though.

In order to add data to our `favorites: FormArray`, go to the previously implemented `add` method
and instead of interacting with the service, call the `push` method to add a new `FormGroup` with the entered data.

<details>
    <summary>show solution</summary>

```ts
// my-movie-list.component.ts


add(): void {
    if (this.myMovieForm.valid) {
      const favorite = this.myMovieForm.value;
      // add a new FormGroup to the FormArray
      this.favorites.push(this.createMovieForm(favorite));
      this.reset();
    } else {
      this.myMovieForm.markAllAsTouched();
    }
}
```
</details>

Serve the application and try to add a Movie via the add form. You should notice that the value you entered will be
displayed instantly as an editable form as well as getting stored into the localstorage.

Now implement the deletion as well.

In the `MyMovieListComponent`, implement a method `removeMovie(i: number)` which should call the `FormArray#removeAt` method
with the given index.

In the template, add a `click` binding to the `button.btn btn__icon` and call the `removeMovie` method.

You get the index from the `context` of the `*ngFor` directive.

<details>
    <summary>show solution</summary>

```html
<!-- my-movie-list.component.html -->


<div class="movie-item" *ngFor="let movieCtrl of favorites.controls; let i = index;">
    <!-- movie-item template -->
</div>

<button class="btn btn__icon" (click)="removeMovie(i)">
    <svg-icon name="delete"></svg-icon>
</button>
```

</details>

Serve the application and try all adding, removing, editing the favorite list.

## Setup Validation

You should notice that users are now able to add multiple movies with the same title. We should implement a validation function
in order to suppress this.

For this, we need to slightly adjust our form setup made in `MyMovieListComponent`.

The `title` control for the `myMovieForm` should receive another [`ValidatorFn`](https://angular.io/api/forms/ValidatorFn).

`FormGroup({ title: [..., Validators.required ] })`

The function should follow the following interface: `(control: AbstractControl): ValidationErrors | null`.
It is up to you if you want to create named, or anonymous function for it.

It should read the `control.value` and search in the `MovieService#getFavorites()` list if there is already an
entry. If an entry was found, return an object with an object defining the key of the error: `{ unique: true }`. In case
the input is valid the function should return `null`.


<details>
    <summary>Show solution</summary>

```ts
// my-movie-list.component.ts

myMovieForm = new FormGroup({
    title: new FormControl('', [
        Validators.required,
        (ctrl) => {
            return !!this.movieService
                .getFavorites()
                .find((favorite) => favorite.title === ctrl.value)
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
```

</details>

Well done, serve the application and try to add a movie with the same title. The application should show you an error state.
If you want to react to the unique error and show a different message, add a similar condition as for the `comment` error message to the template.


<details>
    <summary>Error Message</summary>

```html

<span class="error" *ngIf="showError('title')">
      <ng-container *ngIf="myMovieForm.get('title').hasError('required'); else: unique">
        Entering a title is required
      </ng-container>
      <ng-template #unique>
        You already added that movie, edit it instead
      </ng-template>
</span>
```

</details>

Serve the application and see if the error message gets properly displayed when trying to add a duplicated entry.

## Bonus: Add Error States for formarray controls, re-use templates

The controls in our dynamic `FormArray` are not showing any error messages right now.

Start by implementing a similar technique as for all the other conditional error messages. You will notice that
we could implement a re-usable pattern.

The parts that are dynamic for each case are:
* `FormControl`
* when should we show the error

Start by adding a named `ng-template #commentError` template and paste the contents of the original comment error.

Use it where you want to apply it with an `*ngTemplateOutlet`.

<details>
    <summary>named template</summary>

```html

<ng-template [ngTemplateOutlet]="commentError"></ng-template>

<ng-template #commentError>
  <span class="error" *ngIf="showError('comment')">
      <ng-container *ngIf="myMovieForm.get('comment').hasError('required'); else: minLength">
        Entering a comment is required
      </ng-container>
      <ng-template #minLength>
        Please enter the minimum amount of {{ myMovieForm.get('comment').errors.minlength?.requiredLength }}, right now
        you've entered {{ myMovieForm.get('comment').errors.minlength?.actualLength }}
      </ng-template>
    </span>
</ng-template>
```
</details>

Now let's make the template receive inputs for the parts we want to have dynamic.
We need the `FormControl` as well as the `showError` boolean to be dynamically inserted as input.

Read the input like this: `<ng-template #commentError let-input>`
Now you can use the `input` property inside of the templates scope.

<details>
    <summary>Dynamic Template</summary>

```html

<ng-template #commentError let-input>
  <span class="error" *ngIf="input.showError">
    <ng-container *ngIf="input.ctrl.hasError('required'); else: minLength">
      Entering a comment is required
    </ng-container>
    <ng-template #minLength>
      Please enter the minimum amount of {{ input.ctrl.errors.minlength?.requiredLength }}, right now
      you've entered {{ input.ctrl.errors.minlength?.actualLength }}
    </ng-template>
  </span>
</ng-template>
```
</details>

Final step is to insert the variables into the template outlet. Use the `[ngTemplateOutletContext]` property and assign 
an object with the following shape to your templateOutlet:

```ts
{
    $implicit: { // implicit can be read as let-whatever-the-name-you-want
        showError: // bool value,
        ctrl: // the control
    }
}
```

<details>
    <summary>Template Context</summary>

```html
<!-- add-form -->
<ng-template [ngTemplateOutlet]="commentError"
             [ngTemplateOutletContext]="{
                  $implicit: {
                    showError: showError('comment'),
                    ctrl: myMovieForm.get('comment')
                  }
                }"></ng-template>

<!-- list-item -->
<ng-template [ngTemplateOutlet]="commentError"
             [ngTemplateOutletContext]="{
              $implicit: {
                  showError: !movieCtrl.get('comment').valid,
                  ctrl: movieCtrl.get('comment')
                }
              }">
</ng-template>
```
</details>

Nice, serve the application and see if the error messages are properly displayed when editing or adding data.
