import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IrbGuard } from '../../../ddp-sdk/src/lib/guards/irb.guard';
import { BrowserGuard } from '../../../ddp-sdk/src/lib/guards/browser.guard';
import { AuthGuard } from '../../../ddp-sdk/src/lib/guards/auth.guard';
import { Auth0CodeCallbackComponent } from '../../../ddp-sdk/src/lib/components/login/auth0-code-callback.component';

import { ActivityRedesignedComponent } from '../../../toolkit/src/lib/components/activity/activity-redesigned.component';
import { LoginLandingRedesignedComponent } from '../../../toolkit/src/lib/components/login-landing/login-landing-redesigned.component';
import { RedirectToAuth0LoginRedesignedComponent } from '../../../toolkit/src/lib/components/redirect-to-auth0-login/redirect-to-auth0-login-redesigned.component';
import { WorkflowStartActivityRedesignedComponent } from '../../../toolkit/src/lib/components/activity/workflow-start-activity-redesigned.component';
import { ErrorRedesignedComponent } from '../../../toolkit/src/lib/components/error/error-redesigned.component';
import { StayInformedRedesignedComponent } from '../../../toolkit/src/lib/components/stay-informed/stay-informed-redesigned.component';
import { LovedOneThankYouRedesignedComponent } from '../../../toolkit/src/lib/components/thank-you/loved-one-thank-you-redesigned.component';
import { AgeUpThankYou } from '../../../toolkit/src/lib/components/thank-you/age-up-thank-you.component';
import { SessionExpiredRedesignedComponent } from '../../../toolkit/src/lib/components/session-expired/session-expired-redesigned.component';
import { RedirectToLoginLandingRedesignedComponent } from '../../../toolkit/src/lib/components/redirect-to-login-landing/redirect-to-login-landing-redesigned.component';
import { PasswordRedesignedComponent } from '../../../toolkit/src/lib/components/password/password-redesigned.component';
import { VerifyAgeUpPageComponent } from '../../../toolkit/src/lib/components/age-up/verifyAgeUpPage.component';
import { AcceptAgeUpPageComponent } from '../../../toolkit/src/lib/components/age-up/acceptAgeUpPage.component';
import { HeaderActionGuard } from '../../../toolkit/src/lib/guards/headerAction.guard';

import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
    {
        path: 'about-you',
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/activity/activity-page-redesigned/activity-page-redesigned.module')
          .then(m => m.ActivityPageRedesignedModule),
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
        loadChildren: () => import('../../../toolkit/src/lib/components/dashboard-redesigned/dashboard-redesigned.module')
          .then(m => m.DashboardRedesignedModule),
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
        component: ActivityRedesignedComponent,
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
        component: RedirectToAuth0LoginRedesignedComponent,
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
        loadChildren: () => import('./modules/about-us/about-us.module').then(m => m.AboutUsModule),
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
        component: LovedOneThankYouRedesignedComponent,
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
        loadChildren: () => import('./modules/welcome/welcome.module').then(m => m.WelcomeModule),
        canActivate: [HeaderActionGuard],
        data: { openJoinDialog: true }
    },
    {
        path: 'updates',
        loadChildren: () => import('./modules/welcome/welcome.module').then(m => m.WelcomeModule),
        canActivate: [IrbGuard]
    },
    {
        path: '',
        loadChildren: () => import('./modules/welcome/welcome.module').then(m => m.WelcomeModule),
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
