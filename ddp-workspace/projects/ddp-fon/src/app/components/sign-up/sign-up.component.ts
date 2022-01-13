import { of, BehaviorSubject } from 'rxjs';
import { Route } from '../../constants/Route';
import { catchError, first, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth0ResponseCodes } from '../../constants/auth0';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth0ManualService } from '../../services/auth0-manual.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  Route = Route;

  form: FormGroup = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/),
    ]),
  });

  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private readonly auth0: Auth0ManualService) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth0
      .signUp(this.form.value)
      .pipe(
        first(),
        tap(() => {
          this.error$.next(null);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.error?.code === Auth0ResponseCodes.INVALID_SIGNUP) {
            this.error$.next('This Email Adress already exists!');
          }
          if (err.error?.error) {
            this.error$.next(`Server Error: ${err.error.error}`);
          }

          return of(err);
        }),
      )
      .subscribe();
  }
}
