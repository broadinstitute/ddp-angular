import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';


import { WelcomeComponent } from './components/welcome/welcome.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { StudyListingComponent } from "./components/study-listing-component/study-listing.component";
import { RedirectJoinComponent } from "./components/redirect-join/redirect-join.component";
import {
  LoginLandingComponent, PasswordComponent,
  RedirectToAuth0LoginComponent,
  RedirectToLoginLandingComponent
} from "toolkit";
import { PrionDashboardComponent } from "../../../toolkit-prion/src/lib/components/dashboard/dashboard.component";
import { PrionActivityPageComponent } from "../../../toolkit-prion/src/lib/components/activity-page/activityPage.component";
import { PrionActivityComponent } from "../../../toolkit-prion/src/lib/components/activity/activity.component";
import { PrionWorkflowStartActivityComponent } from "../../../toolkit-prion/src/lib/components/workflow-start-activity/workflowStartActivity.component";
import { PrionErrorComponent } from "../../../toolkit-prion/src/lib/components/error/error.component";
import { PrionSessionExpiredComponent } from "../../../toolkit-prion/src/lib/components/session-expired/sessionExpired.component";

const routes: Routes = [
  {
    path: 'consent',
    component: PrionActivityPageComponent,
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
    path: 'medical',
    component: PrionActivityPageComponent,
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
    path: 'study-listing',
    component: StudyListingComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'dashboard',
    component: PrionDashboardComponent,
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
    component: PrionActivityComponent,
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
    path: 'redirect-join',
    component: RedirectJoinComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'start-study',
    component: PrionWorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'error',
    component: PrionErrorComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'learn-more',
    component: LearnMoreComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'password-reset-done',
    component: RedirectToLoginLandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'session-expired',
    component: PrionSessionExpiredComponent,
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
