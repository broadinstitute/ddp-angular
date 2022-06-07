import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard } from 'ddp-sdk';

import {
  AcceptAgeUpPageComponent,
  ActivityRedesignedComponent,
  AgeUpThankYouComponent,
  DashboardRedesignedComponent,
  ErrorRedesignedComponent, HeaderActionGuard,
  LoginLandingRedesignedComponent,
  PasswordRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
  RedirectToLoginLandingRedesignedComponent,
  SessionExpiredRedesignedComponent,
  VerifyAgeUpPageComponent,
  WorkflowStartActivityRedesignedComponent,
} from 'toolkit';

import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ForYourPhysicianComponent } from './pages/for-your-physician/for-your-physician.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToParticipateComponent } from './pages/how-to-participate/how-to-participate.component';
import { ScientificImpactComponent } from './pages/scientific-impact/scientific-impact.component';
import { Route } from './constants/Route';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.About,
    component: AboutComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.FAQ,
    component: FaqComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.ForYourPhysician,
    component: ForYourPhysicianComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.HowToParticipate,
    component: HowToParticipateComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.ScientificImpact,
    component: ScientificImpactComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.CountMeIn,
    component: WorkflowStartActivityRedesignedComponent,
    canActivate: [IrbGuard, BrowserGuard],
  },
  {
    path: Route.ActivityId,
    component: ActivityRedesignedComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: Route.ActivityLinkId,
    component: ActivityRedesignedComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: Route.AgeUpAccept,
    component: AcceptAgeUpPageComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.AgeUpVerify,
    component: VerifyAgeUpPageComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.AgeUpThankYouProxy,
    component: AgeUpThankYouComponent,
    canActivate: [IrbGuard],
    data: { collect: true },
  },
  {
    path: Route.AgeUpThankYouVerify,
    component: AgeUpThankYouComponent,
    canActivate: [IrbGuard],
    data: { collect: true },
  },
  {
    path: Route.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [IrbGuard, AuthGuard],
  },
  {
    path: Route.Error,
    component: ErrorRedesignedComponent,
  },
  {
    path: Route.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLandingMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordRedesignedComponent,
  },
  {
    path: Route.PasswordResetDone,
    component: RedirectToLoginLandingRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.SessionExpired,
    component: SessionExpiredRedesignedComponent,
    canActivate: [IrbGuard, BrowserGuard],
  },
  {
    path: 'join-list',
    component: HomeComponent,
    canActivate: [HeaderActionGuard],
    data: { openJoinDialog: true }
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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
