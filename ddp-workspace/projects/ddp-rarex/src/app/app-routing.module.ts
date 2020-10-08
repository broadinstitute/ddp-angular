import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard } from 'ddp-sdk';

import {
  DashboardRedesignedComponent,
  LoginLandingRedesignedComponent,
  PasswordRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
} from 'toolkit';

import { RarexActivityPageComponent } from './components/rarex-activity-page/rarex-activity-page.component';
import { RarexActivityRedirectComponent } from './components/rarex-activity-redirect/rarex-activity-redirect.component';
import { ShareMyDataComponent } from './components/share-my-data/share-my-data.component';
import { ActivityCodes } from './constants/activity-codes';
import { RoutePaths } from './router-resources';

const routes: Routes = [
  {
    path: RoutePaths.Activities,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RoutePaths.Survey,
    component: RarexActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RoutePaths.Consent,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityCode: ActivityCodes.CONSENT
    }
  },
  {
    path: RoutePaths.Demographics,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityCode: ActivityCodes.DEMOGRAPHICS
    }
  },
  {
    path: RoutePaths.GeneralMedicalBackgroundSurvey,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityCode: ActivityCodes.GENERAL_MEDICAL_BACKGROUND_SURVEY
    }
  },
  {
    path: RoutePaths.GeneralNeuroDevelopment,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityCode: ActivityCodes.GENERAL_NEURO_DEVELOPMENT
    }
  },
  {
    path: RoutePaths.QualityOfLife,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityCode: ActivityCodes.QUALITY_OF_LIFE
    }
  },
  {
    path: RoutePaths.ParentalConsent,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard,
    ],
    data: {
      activityCode: ActivityCodes.PARENTAL_CONSENT,
    },
  },
  {
    path: RoutePaths.ConsentAssent,
    component: RarexActivityRedirectComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard,
    ],
    data: {
      activityCode: ActivityCodes.CONSENT_ASSENT,
    },
  },
  {
    path: RoutePaths.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RoutePaths.LoginLandingWithMode,
    component: RedirectToAuth0LoginRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RoutePaths.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RoutePaths.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RoutePaths.Password,
    component: PasswordRedesignedComponent
  },
  {
      path: RoutePaths.Welcome,
      component: ShareMyDataComponent,
      pathMatch: 'full',
      canActivate: [IrbGuard]
  },
  {
      path: '**',
      redirectTo: ''
  }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes, {
        enableTracing: false,
        scrollPositionRestoration: 'top'
      })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
