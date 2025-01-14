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
  RedirectToAuth0LoginComponent,
    ToolkitModule,
    ToolkitConfigurationService

} from 'toolkit';

import { DataReleaseComponent } from './components/data-release/data-release.component';
import { EndEnrollComponent } from './components/end-enroll/end-enroll.component';

const routes: Routes = [
  {
    path: 'release-survey',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'RELEASE'
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
    path: 'count-me-in',
    component: WorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: 'data-release',
    component: DataReleaseComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'error',
    component: ErrorComponent
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
    component: EndEnrollComponent
 },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
