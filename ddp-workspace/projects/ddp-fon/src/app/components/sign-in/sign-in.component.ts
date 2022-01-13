import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { Route } from '../../constants/Route';
import { Auth0LoginErrorResponse } from '../../interfaces/auth0';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth0ManualService } from '../../services/auth0-manual.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  Route = Route;

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl(null, [Validators.required]),
  });

  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private readonly auth0: Auth0ManualService) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error$.next(null);

    this.auth0.login(this.form.value, this.setError.bind(this));
  }

  private setError(err: Auth0LoginErrorResponse): void {
    this.error$.next(err.description);
  }
}
