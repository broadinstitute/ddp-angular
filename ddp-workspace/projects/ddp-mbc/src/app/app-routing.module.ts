import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    Auth0CodeCallbackComponent,
    AuthGuard,
    IrbGuard,
    BrowserGuard
} from 'ddp-sdk';

import {
    ActivityPageComponent,
    ActivityComponent,
    DashboardComponent,
    LoginLandingComponent,
    ErrorComponent,
    StayInformedComponent,
    PasswordComponent,
    RedirectToLoginLandingComponent,
    WorkflowStartActivityComponent,
    InternationalPatientsComponent,
    SessionExpiredComponent,
    RedirectToAuth0LoginComponent
} from 'toolkit';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

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
            activityGuid: 'ABOUTYOU',
            createActivityInstance: true
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
        path: 'release-survey',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'RELEASE'
        }
    },
    {
        path: 'tissue-consent',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'TISSUECONSENT'
        }
    },
    {
        path: 'tissue-release',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'TISSUERELEASE'
        }
    },
    {
        path: 'blood-consent',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'BLOODCONSENT'
        }
    },
    {
        path: 'blood-release-survey',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'BLOODRELEASE'
        }
    },
    {
        path: 'followup',
        component: ActivityPageComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ],
        data: {
            activityGuid: 'FOLLOWUP'
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
        component: ActivityComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ]
    },
    {
        path: 'activity-link/:id',
        component: ActivityComponent,
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
        path: 'data-release',
        component: DataReleaseComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'more-details',
        component: MoreDetailsComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'stay-informed',
        component: StayInformedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: 'international-patients',
        component: InternationalPatientsComponent,
        canActivate: [IrbGuard]
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
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full',
        canActivate: [IrbGuard]
    },
    {
        path: 'users/:id/edit',
        redirectTo: 'about-you'
    },
    {
        path: 'consent/:id/keys',
        redirectTo: 'tissue-consent'
    },
    {
        path: 'consent/:id/patient',
        redirectTo: 'tissue-release'
    },
    {
        path: 'bdconsent/:id/keys',
        redirectTo: 'blood-consent'
    },
    {
        path: 'bdconsent/:id/info',
        redirectTo: 'blood-release-survey'
    },
    {
        path: 'followupone/:id',
        redirectTo: 'followup'
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
