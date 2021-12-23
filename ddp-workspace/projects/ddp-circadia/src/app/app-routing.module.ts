import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, IrbGuard } from 'ddp-sdk';

import { RedirectToAuth0LoginRedesignedComponent } from 'toolkit';

import { ActivityPageComponent } from './components/pages/activity-page/activity-page.component';
import { Auth0CodeCallbackComponent } from './components/pages/auth0-code-callback/auth0-code-callback.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { HomeComponent } from './components/pages/home/home.component';
import { IrbPasswordComponent } from './components/pages/irb-password/irb-password.component';
import { JoinUsComponent } from './components/pages/join-us/join-us.component';
import { LoginLandingComponent } from './components/pages/login-landing/login-landing.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { Route } from './constants/route';
import { EnrollmentPausedGuard } from './guards/enrollment-paused.guard';

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
    path: Route.JoinUs,
    component: JoinUsComponent,
    canActivate: [IrbGuard, EnrollmentPausedGuard],
  },
  {
    path: Route.StayInformed,
    component: StayInformedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Dashboard,
    component: DashboardComponent,
    canActivate: [IrbGuard, AuthGuard],
  },
  {
    path: Route.SessionExpired,
    component: SessionExpiredComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.ActivityId,
    component: ActivityPageComponent,
    canActivate: [IrbGuard, AuthGuard],
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
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
