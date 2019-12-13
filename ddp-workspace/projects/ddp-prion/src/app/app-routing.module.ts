import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';


import { WelcomeComponent } from './components/welcome/welcome.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { ActivityPageComponent, DashboardComponent, LoginLandingComponent, RedirectToAuth0LoginComponent, ErrorComponent,
  RedirectToLoginLandingComponent,
  SessionExpiredComponent,
  PasswordComponent,
  WorkflowStartActivityComponent,
ActivityComponent} from 'projects/prion-toolkit/src/public-api';
import { AccountVerificationComponent } from './components/account-verification/account-verification.component';

const routes: Routes = [
  {
    path: 'consent',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'PRIONCONSENT'
    }
  },
  {
    path: 'release-survey', //TODO: Probably change this path
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'PRIONMEDICAL'
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
    path: 'account-verification',
    component: AccountVerificationComponent,
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
    path: 'start-study', //TODO: Make verification email redirect here and make it so we can't get here any other way or do this more than once
    component: WorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'error',
    component: ErrorComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'more-details',
    component: MoreDetailsComponent,
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
  {
    path: '',
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
export class AppRoutingModule { }
