import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Auth0CodeCallbackComponent, IrbGuard } from 'ddp-sdk';

import {
  LoginLandingRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
} from 'toolkit';

import { Route } from './constants/route';
import { HomeComponent } from './components/pages/home/home.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.AboutUs,
    component: AboutUsComponent,
    pathMatch: 'full',
  },
  {
    path: Route.LearnMore,
    component: LearnMoreComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.StayInformed,
    component: StayInformedComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordComponent,
  },
  {
    path: Route.PreScreening,
    component: PreScreeningComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLandingMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Error,
    component: ErrorComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.Dashboard,
    component: DashboardComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.ActivityId,
    component: ActivityPageComponent,
    canActivate: [IrbGuard],
  },
  {
    path: '**',
    redirectTo: Route.Home,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
