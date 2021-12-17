import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  ChangeLanguageRedirectComponent,
  IrbGuard,
  BrowserGuard
} from 'ddp-sdk';

import { CookiesConsentGuard } from 'toolkit';

import {
  PrionDashboardComponent,
  PrionActivityPageComponent,
  PrionActivityComponent,
  PrionWorkflowStartActivityComponent,
  PrionErrorComponent,
  PrionSessionExpiredComponent,
  PrionPasswordComponent,
  PrionLoginLandingComponent,
  PrionRedirectToAuth0LoginComponent,
  PrionRedirectToLoginLandingComponent
} from 'toolkit-prion';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { StudyListingComponent } from './components/study-listing-component/study-listing.component';
import { RedirectJoinComponent } from './components/redirect-join/redirect-join.component';
import { PrivacyPolicyFullComponent } from './components/privacy-policy/privacy-policy-full.component';
import { ThirdPartyComponent } from './components/third-party/third-party.component';

const routes: Routes = [
  {
    path: 'consent',
    component: PrionActivityPageComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard,
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
      CookiesConsentGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'PRIONMEDICAL'
    }
  },
  {
    path: '3rd-party',
    component: ThirdPartyComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'study-listing',
    component: StudyListingComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'dashboard',
    component: PrionDashboardComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard,
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
      CookiesConsentGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'login-landing',
    component: PrionLoginLandingComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'login-landing/:mode',
    component: PrionRedirectToAuth0LoginComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'redirect-join',
    component: RedirectJoinComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'change-language-redirect',
    component: ChangeLanguageRedirectComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'start-study',
    component: PrionWorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'error',
    component: PrionErrorComponent,
    canActivate: [
      CookiesConsentGuard
    ]
  },
  {
    path: 'learn-more',
    component: LearnMoreComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyFullComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'password-reset-done',
    component: PrionRedirectToLoginLandingComponent,
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
    ]
  },
  {
    path: 'session-expired',
    component: PrionSessionExpiredComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      CookiesConsentGuard
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
    canActivate: [
      IrbGuard,
      CookiesConsentGuard
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
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
