import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  BrowserGuard,
  IrbGuard,
} from 'ddp-sdk';

import {
  PasswordRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
} from 'toolkit';

import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { ActivityRedirectComponent } from './components/activity-redirect/activity-redirect.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { ParticipantsListComponent } from './components/participants-list/participants-list.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { ShareMyDataComponent } from './components/share-my-data/share-my-data.component';
import { ErrorComponent } from './pages/error/error.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { GovernedUserGuard } from './guards/governed-user.guard';
import { SelfEnrolledUserGuard } from './guards/self-enrolled-user.guard';
import { RoutePaths } from './router-resources';

const routes: Routes = [
  {
    path: RoutePaths.Activities,
    component: ActivityRedirectComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: RoutePaths.Survey,
    component: ActivityPageComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: RoutePaths.Dashboard,
    component: DashboardComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard, SelfEnrolledUserGuard],
  },
  {
    path: RoutePaths.ParticipantsList,
    component: ParticipantsListComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard, GovernedUserGuard],
  },
  {
    path: RoutePaths.LoginLandingWithMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.LoginLanding,
    component: LoginLandingComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.Password,
    component: PasswordRedesignedComponent,
  },
  {
    path: RoutePaths.Error,
    component: ErrorComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.PrivacyPolicy,
    component: PrivacyPolicyComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.TermsOfUse,
    component: TermsAndConditionsComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.LoginRedirect,
    component: RedirectToLoginComponent,
    canActivate: [IrbGuard],
  },
  {
    path: RoutePaths.Index,
    component: ShareMyDataComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
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
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
