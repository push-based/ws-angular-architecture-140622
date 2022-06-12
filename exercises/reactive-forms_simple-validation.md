# Reactive Forms - Simple Validation

Maybe you've noticed that our currently implemented form
will let users enter empty data and still save it to the list of
favorite movies. In this exercise we want to make use of validations
to keep our persistence layer clean from bad user data.

## Goal

At the end of this exercise we want to have a proper validation of the entered data.
On top of that we want to inform our users about the invalid state of their inputs.

## Setup Validation

We need to adjust our form setup made in `MyMovieListComponent`.

* The `title` control should be `required`
* The `comment` control should be `required` & `minLength(5)`

On top of that, add a condition in the `save` method in order to check if the form is `valid` or not.
Only if the form is `valid` send the data to the `MovieService`.

<details>
    <summary>Show solution</summary>

```ts
// my-movie-list.component.ts

myMovieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
});

add(): void {
    if (this.myMovieForm.valid) {
        this.movieService.upsertFavorite(this.myMovieForm.value);
        this.reset();
        this.myMovies = this.movieService.getFavorites();
    }
}

```

</details>

Serve the application and try to enter invalid data. The form shouldn't let u anymore.

## Display error state to user

Now we want to display our user some kind of information about the error state 
in our form.

Displaying error states is not that trivial as you might think upfront.
You want to show the error state only under certain conditions.
Considering the fact that our values for our form are actually invalid inputs, we do not want
to present an instantly invalid set of form fields to our user.

Instead, the `ReactiveForms` api is giving us some properties to make sure the user
has a nice experience while interacting with the form.

We want to present the user an error message for a field only in case a field was `touched` or
the form was `submitted`.

To mark all fields on `touched` on submit, consider calling the `myMovieForm.markAllAsTouched();` in case an invalid input was saved
from the user.

You should also prepare a helper function in your component which should tell the template if a control is invalid or not.

<details>
    <summary> MyMovieListComponent </summary>

```ts
// my-movie-list.component.ts
add(): void {
    if (this.myMovieForm.valid) {
        this.movieService.upsertFavorite(this.myMovieForm.value);
        this.reset();
        this.myMovies = this.movieService.getFavorites();
    } else {
        this.myMovieForm.markAllAsTouched();
    }
}

// helper util for template to show error

showError(controlName: string): boolean {
    const ctrl = this.myMovieForm.get(controlName);
    return !ctrl.valid && ctrl.touched;
}
```

</details>

In our template we want to display a `span.error` whenever the corresponding formControl is invalid & touched.

<details>
    <summary> Template </summary>

```html
<!-- my-movie-list.component.html -->

<!-- add into form-group -->
<span class="error" *ngIf="showError('title')">
  Please enter valid data
</span>

<!-- add into form-group -->
<span class="error" *ngIf="showError('comment')">
  Please enter valid data
</span>
```
</details>

If you want, you can also add styles in order to make the error messages appear in red.

<details>
    <summary>Styles</summary>

```scss
/* my-movie-list.component.scss */

.error {
    color: darkred;
    font-size: var(--text-sm);
}
```

</details>

Well done, test your application and see if all form interactions result in a proper UX.

## Use default css classes

The `ReactiveForms` will add classes to their host-element based on their current status.
If you inspect the input elements in your `DOM` you will notice that angular
adds classes to each of the inputs (`ng-valid`, `ng-untouched`, ...).

We can make use of that to style our input fields as well.

<details>
    <summary>Styles</summary>

```scss
/* my-movie-list.component.scss */

textarea.ng-touched.ng-invalid,
input.ng-touched.ng-invalid {
  border: 2px solid darkred;
  color: darkred;
}
```

</details>

## Bonus:

Use `control.hasError(validatorName)` and the `control.errors` property in order to
display conextual information of the error to the user.

You could display an error message to the user which says smth like: `Please enter at least 5 characters` when the `minLength` validator kicks in.
Otherwise you could say an input is `required`.

<details>
    <summary>Hints</summary>

```html
<ng-container *ngIf="myMovieForm.get('comment').hasError('required'); else: ...">
```

```html
 <ng-template ...>
    Please enter the minimum amount of {{ myMovieForm.get('comment').errors.minlength?.requiredLength }}, right now
    you've entered {{ myMovieForm.get('comment').errors.minlength?.actualLength }}
</ng-template>
```
</details> 
