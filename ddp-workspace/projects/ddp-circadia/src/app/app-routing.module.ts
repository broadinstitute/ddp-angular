import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IrbGuard } from 'ddp-sdk';

import { RedirectToAuth0LoginRedesignedComponent } from 'toolkit';

import { Auth0CodeCallbackComponent } from './components/pages/auth0-code-callback/auth0-code-callback.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { HomeComponent } from './components/pages/home/home.component';
import { IrbPasswordComponent } from './components/pages/irb-password/irb-password.component';
import { LoginLandingComponent } from './components/pages/login-landing/login-landing.component';
import { Route } from './constants/route';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.Password,
    component: IrbPasswordComponent,
  },
  {
    path: Route.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLanding,
    component: LoginLandingComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLandingMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Error,
    component: ErrorComponent,
    canActivate: [IrbGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
