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
  PasswordRedesignedComponent,
  HeaderActionGuard
} from 'toolkit';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './aсtivity-guids';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  {
    path: AppRoutes.AboutYou,
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
    path: AppRoutes.Consent,
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
    path: AppRoutes.Release,
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
    path: AppRoutes.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: AppRoutes.LocalAuth,
    component: Auth0CodeCallbackComponent,
    canActivate: [
      IrbGuard
    ]
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
    path: AppRoutes.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.LoginLandingMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.CountMeIn,
    component: WorkflowStartActivityRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Password,
    component: PasswordRedesignedComponent
  },
  {
    path: AppRoutes.MoreDetails,
    component: FaqComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.JoinList,
    component: WelcomeComponent,
    canActivate: [
      HeaderActionGuard
    ],
    data: {
      openJoinDialog: true
    }
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
