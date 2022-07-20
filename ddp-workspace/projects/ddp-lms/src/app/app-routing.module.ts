import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard} from 'ddp-sdk';

import {
  AcceptAgeUpPageComponent,
  ActivityPageRedesignedComponent,
  AgeUpThankYouComponent,
  ErrorRedesignedComponent,
  HeaderActionGuard,
  PasswordRedesignedComponent,
  RedirectToAuth0LoginRedesignedComponent,
  RedirectToLoginLandingRedesignedComponent,
  SessionExpiredRedesignedComponent,
  VerifyAgeUpPageComponent,
} from 'toolkit';

import {AboutComponent} from './pages/about/about.component';
import {FaqComponent} from './pages/faq/faq.component';
import {ForYourPhysicianComponent} from './pages/for-your-physician/for-your-physician.component';
import {HomeComponent} from './pages/home/home.component';
import {HowToParticipateComponent} from './pages/how-to-participate/how-to-participate.component';
import {ScientificImpactComponent} from './pages/scientific-impact/scientific-impact.component';
import {Route} from './constants/Route';

import {ActivityComponent} from './activity/activity.component';
import {ActivityPageComponent} from './activity-page/activity-page.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {WorkflowStartComponent} from './components/workflow-start/workflow-start.component';


const routes: Routes = [
  {
    path: 'about-you',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'ABOUTYOU'
    }
  },
  {
    path: 'about-your-child',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'ABOUTCHILD'
    }
  },
  {
    path: 'loved-one',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'LOVEDONE'
    }
  },
  {
    path: 'consent',
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
    path: 'consent-assent',
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
    path: 'parental-consent',
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
    path: 'release-survey',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'RELEASE_SELF'
    }
  },
  {
    path: 'release-minor-survey',
    component: ActivityPageRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ],
    data: {
      activityGuid: 'RELEASE_MINOR'
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
    path: 'auth',
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'activity/:id',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: 'activity-link/:id',
    component: ActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
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
    component: WorkflowStartComponent,
    canActivate: [IrbGuard, BrowserGuard],
  },
  {
    path: Route.ActivityId,
    component: ActivityComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: Route.ActivityLinkId,
    component: ActivityComponent,
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
    data: {collect: true},
  },
  {
    path: Route.AgeUpThankYouVerify,
    component: AgeUpThankYouComponent,
    canActivate: [IrbGuard],
    data: {collect: true},
  },
  {
    path: Route.Dashboard,
    component: DashboardComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: Route.Error,
    component: ErrorRedesignedComponent,
  },
  {
    path: Route.LoginLanding,
    component: LandingPageComponent,
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
    data: {openJoinDialog: true}
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
export class AppRoutingModule {
}
