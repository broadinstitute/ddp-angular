import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './activity-guids';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserRegistrationPrequalComponent } from './components/user-registration-prequal/user-registration-prequal.component';
import { PrismComponent } from './components/prism/prism.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';

import {
  Auth0CodeCallbackComponent,
  AuthGuard,
  AdminAuthGuard,
  ChangeLanguageRedirectComponent,
  IrbGuard
} from 'ddp-sdk';

import {
  LoginLandingRedesignedComponent,
  AdminLoginLandingComponent,
  ActivityPageRedesignedComponent,
  DashboardRedesignedComponent,
  ActivityRedesignedComponent,
  ErrorRedesignedComponent,
  PasswordRedesignedComponent,
  SessionExpiredRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
  RedirectToLoginLandingRedesignedComponent
} from 'toolkit';

const routes: Routes = [
  {
    path: AppRoutes.Join,
    component: UserRegistrationPrequalComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Consent,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ActivityGuids.Consent
    }
  },
  {
    path: AppRoutes.CovidSurvey,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ActivityGuids.Covid
    }
  },
  {
    path: AppRoutes.SymptomSurvey,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ActivityGuids.Symptom
    }
  },
  {
    path: AppRoutes.Address,
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ],
    data: {
      activityGuid: ActivityGuids.Address
    }
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
    path: AppRoutes.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      AuthGuard
    ]
  },
  {
    path: AppRoutes.LanguageRedirect,
    component: ChangeLanguageRedirectComponent,
    canActivate: [
      IrbGuard
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
    path: AppRoutes.AdminLoginLanding,
    component: AdminLoginLandingComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.Prism,
    component: PrismComponent,
    canActivate: [
      IrbGuard,
      AdminAuthGuard
    ]
  },
  {
    path: AppRoutes.EnrollSubject,
    component: EnrollmentComponent,
    canActivate: [
      IrbGuard,
      AdminAuthGuard
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
    path: AppRoutes.Error,
    component: ErrorRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.SessionExpired,
    component: SessionExpiredRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
  },
  {
    path: AppRoutes.AdminSessionExpired,
    component: SessionExpiredRedesignedComponent,
    canActivate: [
      IrbGuard
    ],
    data: { isAdmin: true }
  },
  {
    path: AppRoutes.Password,
    component: PasswordRedesignedComponent
  },
  {
    path: AppRoutes.PasswordResetDone,
    component: RedirectToLoginLandingRedesignedComponent,
    canActivate: [
      IrbGuard
    ]
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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
