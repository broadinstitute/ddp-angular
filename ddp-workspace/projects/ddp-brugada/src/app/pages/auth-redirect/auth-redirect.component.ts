import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Auth0AdapterService, CompositeDisposable } from 'ddp-sdk';

import { Route } from '../../constants/Route';

enum AuthMode {
  Login = 'login',
  SignUp = 'signup',
}

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrls: ['./auth-redirect.component.scss'],
})
export class AuthRedirectComponent implements OnInit, OnDestroy {
  mode = '';
  private subs = new CompositeDisposable();

  constructor(private route: ActivatedRoute, private router: Router, private auth0Adapter: Auth0AdapterService) {}

  ngOnInit(): void {
    const sub = this.route.paramMap.pipe(map(params => params.get('mode'))).subscribe(mode => {
      switch (mode) {
        case AuthMode.SignUp:
          return this.signUpRedirect();
        case AuthMode.Login:
          return this.loginRedirect();
        default:
          return this.homeRedirect();
      }
    });

    this.subs.addNew(sub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  loginRedirect(): void {
    this.auth0Adapter.login();
  }

  signUpRedirect(): void {
    this.router.navigateByUrl(Route.Join);
  }

  homeRedirect(): void {
    this.router.navigateByUrl(Route.Home);
  }
}
