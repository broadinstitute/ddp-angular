import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth0ManualService } from '../../services/auth0-manual.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
  });

  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private readonly auth0: Auth0ManualService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth0
      .resetPassword(this.form.value.email)
      .pipe(
        first(),
        tap(() => {
          this.error$.next(null);
          this.router.navigate(['login'], {
            queryParams: {
              reset_password: true,
            },
          });
        }),
        catchError((err: HttpErrorResponse) => {
          this.error$.next(`Server Error: ${err.error.error}`);
          return of();
        }),
      )
      .subscribe();
  }
}
