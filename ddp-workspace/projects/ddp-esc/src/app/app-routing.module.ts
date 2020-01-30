import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';

import {
  ActivityPageComponent,
  ActivityComponent,
  DashboardComponent,
  LoginLandingComponent,
  ErrorComponent,
  StayInformedComponent,
  PasswordComponent,
  RedirectToLoginLandingComponent,
  WorkflowStartActivityComponent,
  InternationalPatientsComponent,
  SessionExpiredComponent,
  RedirectToAuth0LoginComponent
} from 'toolkit';

const routes: Routes = [
  {
    path: 'about-you',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: '' // to be defined later
    }
  },
  {
    path: 'consent',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: '' // to be defined later
    }
  },
  {
    path: 'followup-consent',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: '' // to be defined later
    }
  },
  {
    path: 'release-survey',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: '' // to be defined later
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'auth',
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'activity/:id',
    component: ActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'activity-link/:id',
    component: ActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'login-landing',
    component: LoginLandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'login-landing/:mode',
    component: RedirectToAuth0LoginComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'count-me-in',
    component: WorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  // {
  //   path: 'about-us',
  //   component: AboutUsComponent,
  //   canActivate: [IrbGuard]
  // },
  {
    path: 'error',
    component: ErrorComponent,
    canActivate: [IrbGuard]
  },
  // {
  //   path: 'more-details',
  //   component: MoreDetailsComponent,
  //   canActivate: [IrbGuard]
  // },
  {
    path: 'stay-informed',
    component: StayInformedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'international-patients',
    component: InternationalPatientsComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'password-reset-done',
    component: RedirectToLoginLandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'session-expired',
    component: SessionExpiredComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: 'password',
    component: PasswordComponent
  },
  // {
  //   path: '',
  //   component: WelcomeComponent,
  //   pathMatch: 'full',
  //   canActivate: [IrbGuard]
  // },
  {
    path: 'about-you/:id',
    redirectTo: 'about-you'
  },
  {
    path: 'consent/:id',
    redirectTo: 'consent'
  },
  {
    path: 'followup-consent/:id',
    redirectTo: 'followup-consent'
  },
  {
    path: 'release-survey/:id',
    redirectTo: 'release-survey'
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
