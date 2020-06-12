import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';

import { LoginLandingRedesignedComponent, RedirectToAuth0LoginComponent } from 'toolkit';
import * as RouterResource from './router-resources';

import { WelcomeComponent } from './components/welcome/welcome';
import { AboutUsComponent } from './components/about-us/about-us';
import { JoinUsComponent } from './components/join-us/join-us';
import { AboutInitiativeComponent } from './components/about-initiative/about-initiative';
import { DataAccessComponent } from './components/data-access/data-access';
import { PasswordComponent } from './components/password/password';
import { DashBoardComponent } from './components/dashboard/dashboard';
import { ErrorComponent } from './components/error/error';
import { StatisticsComponent } from './components/statistics/statistics';
import { SessionExpiredComponent } from './components/session-expired/session-expired';
import { PasswordResetComponent } from './components/password-reset/password-reset';
import { AuthComponent } from './components/Auth/auth';

const routes: Routes = [
  {
      path: RouterResource.Error,
      component: ErrorComponent,
      canActivate: [IrbGuard]
  },
  {
      path: RouterResource.Statistics,
      component: StatisticsComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ]
  },
  {
    path: RouterResource.Dashboard,
    component: DashBoardComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RouterResource.PasswordResetDone,
    component: PasswordResetComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.SessionExpired,
    component: SessionExpiredComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: RouterResource.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.LoginLandingMode,
    component: RedirectToAuth0LoginComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Auth,
    component: AuthComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Password,
    component: PasswordComponent
  },
  {
    path: RouterResource.DataAccess,
    component: DataAccessComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.AboutInitiative,
    component: AboutInitiativeComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.AboutUs,
    component: AboutUsComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.JoinUs,
    component: JoinUsComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Welcome,
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
