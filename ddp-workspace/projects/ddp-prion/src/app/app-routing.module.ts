import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';

import {
  RedirectToAuth0LoginComponent
} from "toolkit";

import {
  PrionDashboardComponent,
  PrionActivityPageComponent,
  PrionActivityComponent,
  PrionWorkflowStartActivityComponent,
  PrionErrorComponent,
  PrionSessionExpiredComponent,
  PrionPasswordComponent,
  PrionLoginLandingComponent,
  PrionRedirectToLoginLandingComponent
} from 'toolkit-prion';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { StudyListingComponent } from "./components/study-listing-component/study-listing.component";
import { RedirectJoinComponent } from "./components/redirect-join/redirect-join.component";
import { ChangeLanguageRedirectComponent } from "./components/change-language-redirect/change-language-redirect.component";

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
    component: PrionLoginLandingComponent,
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
    path: 'change-language-redirect/:destination/:language',
    component: ChangeLanguageRedirectComponent,
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
    component: PrionRedirectToLoginLandingComponent,
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
    component: PrionPasswordComponent
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
