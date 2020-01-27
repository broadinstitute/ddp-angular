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
    ActivityPageComponent,
    DashboardComponent,
    LoginLandingComponent,
    ErrorComponent,
    StayInformedComponent,
    PasswordComponent,
    RedirectToLoginLandingComponent,
    WorkflowStartActivityComponent,
    SessionExpiredComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: ActivityPageComponent,
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
        component: LoginLandingComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'login-landing/:mode',
        component: RedirectToAuth0LoginComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'count-me-in',
        component: WorkflowStartActivityComponent,
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
        component: ErrorComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'more-details',
        component: FaqComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'stay-informed',
        component: StayInformedComponent,
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
        component: SessionExpiredComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard
        ]
    },
    {
        path: 'password',
        component: PasswordComponent
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
