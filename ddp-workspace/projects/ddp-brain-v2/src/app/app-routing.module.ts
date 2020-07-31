import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  IrbGuard,
  AuthGuard,
  Auth0CodeCallbackComponent
} from 'ddp-sdk';
import {
  ActivityPageRedesignedComponent,
  DashboardRedesignedComponent,
  ActivityRedesignedComponent,
  LoginLandingRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
  WorkflowStartActivityRedesignedComponent,
  PasswordRedesignedComponent
} from 'toolkit';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './aсtivity-guids';

import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {
    path: 'about-you',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ''
    }
  },
  {
    path: 'consent',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ''
    }
  },
  {
    path: 'release-survey',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ''
    }
  },
  {
    path: 'dashboard',
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: 'auth',
    component: Auth0CodeCallbackComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: 'activity/:id',
    component: ActivityRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: 'activity-link/:id',
    component: ActivityRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: 'login-landing',
    component: LoginLandingRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: 'login-landing/:mode',
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: 'count-me-in',
    component: WorkflowStartActivityRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: 'password',
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
    path: 'about-you/:id',
    redirectTo: AppRoutes.AboutYou
  },
  {
    path: 'consent/:id',
    redirectTo: AppRoutes.Consent
  },
  {
    path: 'release-survey/:id',
    redirectTo: AppRoutes.Release
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
