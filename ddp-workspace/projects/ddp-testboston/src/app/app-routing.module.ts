import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutes } from './app-routes';
import { AppGuids } from './app-guids';

import { WelcomeComponent } from './components/welcome/welcome.component';

import {
  AuthGuard,
  IrbGuard
} from 'ddp-sdk';

import {
  WorkflowStartActivityRedesignedComponent,
  LoginLandingRedesignedComponent,
  ActivityPageRedesignedComponent,
  DashboardRedesignedComponent,
  ActivityRedesignedComponent,
  ErrorRedesignedComponent,
  PasswordRedesignedComponent,
  SessionExpiredRedesignedComponent
} from 'toolkit';
import { UserRegistrationPrequalComponent } from './user-registration-prequal/userRegistrationPrequal.component';

const routes: Routes = [
  {
    path: AppRoutes.Prequalifier,
    component: WorkflowStartActivityRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Consent,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: AppGuids.Consent
    }
  },
  {
    path: AppRoutes.CovidSurvey,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: AppGuids.Covid
    }
  },
  {
    path: AppRoutes.ActivityId,
    component: ActivityRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: AppRoutes.ActivityLinkId,
    component: ActivityRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: AppRoutes.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: AppRoutes.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Error,
    component: ErrorRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.SessionExpired,
    component: SessionExpiredRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Password,
    component: PasswordRedesignedComponent
  },
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.UserRegistrationPrequal,
    component: UserRegistrationPrequalComponent,
    canActivate: [
      IrbGuard
    ]
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
export class AppRoutingModule { }
