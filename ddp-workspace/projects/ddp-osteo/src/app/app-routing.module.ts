import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    Auth0CodeCallbackComponent,
    AuthGuard,
    IrbGuard,
    BrowserGuard
} from 'ddp-sdk';

import {
    ActivityRedesignedComponent,
    ActivityPageRedesignedComponent,
    DashboardRedesignedComponent,
    LoginLandingRedesignedComponent,
    ErrorRedesignedComponent,
    StayInformedRedesignedComponent,
    PasswordRedesignedComponent,
    RedirectToLoginLandingComponent,
    WorkflowStartActivityRedesignedComponent,
    SessionExpiredRedesignedComponent,
    ActivityLinkComponent,
    LovedOneThankYouComponent,
    RedirectToAuth0LoginComponent,
    HeaderActionGuard,
    VerifyAgeUpPageComponent,
    AcceptAgeUpPageComponent,
    AgeUpThankYou
} from 'toolkit';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';

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
        component: DashboardRedesignedComponent,
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
        component: ActivityRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ]
    },
    {
        path: 'activity-link/:id',
        component: ActivityLinkComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ]
    },
    {
        path: 'login-landing',
        component: LoginLandingRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'login-landing/:mode',
        component: RedirectToAuth0LoginComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'count-me-in',
        component: WorkflowStartActivityRedesignedComponent,
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
        path: 'error',
        component: ErrorRedesignedComponent,
        canActivate: [IrbGuard]
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
        component: LovedOneThankYouComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'thank-you',
        component: AgeUpThankYou,
        canActivate: [IrbGuard],
        data: { verify: true }
    },
    {
        path: 'proxy-thank-you',
        component: AgeUpThankYou,
        canActivate: [IrbGuard],
        data: { collect: true }
    },
    {
        path: 'password-reset-done',
        component: RedirectToLoginLandingComponent,
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
