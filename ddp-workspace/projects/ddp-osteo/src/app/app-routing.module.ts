import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    Auth0CodeCallbackComponent,
    AuthGuard,
    IrbGuard,
    BrowserGuard, ChangeLanguageRedirectComponent
} from 'ddp-sdk';

import {
    ActivityPageRedesignedComponent,
    ErrorRedesignedComponent,
    StayInformedRedesignedComponent,
    PasswordRedesignedComponent,
    RedirectToLoginLandingRedesignedComponent,
    SessionExpiredRedesignedComponent,
    LovedOneThankYouRedesignedComponent,
    RedirectToAuth0LoginRedesignedComponent,
    HeaderActionGuard,
    VerifyAgeUpPageComponent,
    AcceptAgeUpPageComponent,
    AgeUpThankYouComponent,
    ThankYouFamilyHistoryComponent
} from 'toolkit';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';

import { ParticipationComponent } from './components/participation/participation.component';
import { ScientificImpactComponent } from './components/scientific-impact/scientific-impact.component';
import { PhysiciansComponent } from './components/physicians/physicians.component';

import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {WorkflowStartComponent} from './components/workflow-start/workflow-start.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';


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
        path: 'login-landing',
        component: LandingPageComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'login-landing/:mode',
        component: RedirectToAuth0LoginRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'count-me-in',
        component: WorkflowStartComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard
        ]
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'participation',
        component: ParticipationComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'physicians',
        component: PhysiciansComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'scientific-impact',
        component: ScientificImpactComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'error',
        component: ErrorRedesignedComponent
    },
    {
        path: 'more-details',
        component: FaqComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'stay-informed',
        component: StayInformedRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'loved-one-thank-you',
        component: LovedOneThankYouRedesignedComponent,
        canActivate: [IrbGuard]
    },
  {
        path: 'family-history-thank-you',
        component: ThankYouFamilyHistoryComponent,
        canActivate: [IrbGuard]
    },

    {
        path: 'thank-you',
        component: AgeUpThankYouComponent,
        canActivate: [IrbGuard],
        data: { verify: true }
    },
    {
        path: 'proxy-thank-you',
        component: AgeUpThankYouComponent,
        canActivate: [IrbGuard],
        data: { collect: true }
    },
    {
        path: 'password-reset-done',
        component: RedirectToLoginLandingRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'session-expired',
        component: SessionExpiredRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard
        ]
    },
    {
        path: 'password',
        component: PasswordRedesignedComponent
    },
    {
        path: 'verify',
        component: VerifyAgeUpPageComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'accept',
        component: AcceptAgeUpPageComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'join-list',
        component: WelcomeComponent,
        canActivate: [HeaderActionGuard],
        data: { openJoinDialog: true }
    },
    {
        path: 'updates',
        component: WelcomeComponent,
        canActivate: [IrbGuard]
    },
    {
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full',
        canActivate: [IrbGuard]
    },
    {
        path: 'change-language-redirect',
        component: ChangeLanguageRedirectComponent,
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
    enableTracing: false,
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
