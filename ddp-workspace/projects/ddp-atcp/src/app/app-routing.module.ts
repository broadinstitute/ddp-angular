import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';

import { LoginLandingRedesignedComponent } from 'toolkit';
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
    path: 'login-landing',
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'auth',
    component: Auth0CodeCallbackComponent,
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
