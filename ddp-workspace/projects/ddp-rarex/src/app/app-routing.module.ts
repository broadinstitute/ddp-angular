import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard} from 'ddp-sdk';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { RoutePaths } from './router-resources';
import {
  ActivityPageRedesignedComponent, ActivityRedesignedComponent, DashboardRedesignedComponent,
  LoginLandingRedesignedComponent,
  PasswordRedesignedComponent, RedirectToAuth0LoginRedesignedComponent,
  WorkflowStartActivityRedesignedComponent
} from 'toolkit';

const routes: Routes = [
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
      path: RoutePaths.LoginLanding,
      component: LoginLandingRedesignedComponent,
      canActivate: [IrbGuard]
    },
    {
      path: RoutePaths.LoginLandingWithMode,
      component: RedirectToAuth0LoginRedesignedComponent,
      canActivate: [IrbGuard]
    },
    {
      path: RoutePaths.Consent,
      component: ActivityPageRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ],
      data: {
        activityGuid: 'CONSENT'
      }
    },
    {
      path: RoutePaths.ConsentAssent,
      component: ActivityPageRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ],
      data: {
        activityGuid: 'CONSENT_ASSENT'
      }
    },
    {
      path: RoutePaths.ParentalConsent,
      component: ActivityPageRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ],
      data: {
        activityGuid: 'PARENTAL_CONSENT'
      }
    },
    {
      path: RoutePaths.Demographics,
      component: ActivityPageRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ],
      data: {
        activityGuid: 'DEMOGRAPHICS'
      }
    },
    {
      path: RoutePaths.MedicalBackground,
      component: ActivityPageRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ],
      data: {
        activityGuid: 'GENERAL_MEDICAL_BACKGROUND_SURVEY'
      }
    },
    {
      path: RoutePaths.Auth,
      component: Auth0CodeCallbackComponent,
      canActivate: [IrbGuard]
    },
    {
      path: RoutePaths.Activity,
      component: ActivityRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ]
    },
    {
      path: RoutePaths.ShareMyData,
      component: WorkflowStartActivityRedesignedComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard
      ],
      data: {
        activityGuid: 'PREQUAL'
      }
    },
    {
      path: RoutePaths.Password,
      component: PasswordRedesignedComponent
    },
    {
        path: RoutePaths.Welcome,
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
    imports: [
      RouterModule.forRoot(routes, {
        enableTracing: false,
        scrollPositionRestoration: 'top'
      })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
