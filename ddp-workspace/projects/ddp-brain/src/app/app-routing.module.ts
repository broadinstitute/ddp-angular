import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    IrbGuard,
    AuthGuard,
    Auth0CodeCallbackComponent,
    AdminAuthGuard,
} from 'ddp-sdk';

import {
    ActivityPageRedesignedComponent,
    DashboardRedesignedComponent,
    ActivityRedesignedComponent,
    LoginLandingRedesignedComponent,
    RedirectToAuth0LoginRedesignedComponent,
    WorkflowStartActivityRedesignedComponent,
    PasswordRedesignedComponent,
    StayInformedRedesignedComponent,
    ErrorRedesignedComponent,
    HeaderActionGuard,
    RedirectToLoginLandingRedesignedComponent,
    AgeUpThankYouComponent,
    VerifyAgeUpPageComponent,
    AcceptAgeUpPageComponent,
    SessionExpiredRedesignedComponent,
    AdminLoginLandingComponent,
} from 'toolkit';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './aсtivity-guids';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaqComponent } from './components/faq/faq.component';
import { DataComponent } from './components/data/data.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PrismComponent } from './components/prism/prism.component';

const routes: Routes = [
    {
        path: AppRoutes.Prism,
        component: PrismComponent,
        canActivate: [
            IrbGuard,
            AdminAuthGuard
        ]
    },
    {
        path: AppRoutes.AdminLanding,
        component: AdminLoginLandingComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.AdminSessionExpired,
        component: SessionExpiredRedesignedComponent,
        canActivate: [IrbGuard],
        data: {
            isAdmin: true
        }
    },
    {
        path: AppRoutes.AboutYou,
        component: ActivityPageRedesignedComponent,
        canActivate: [
            IrbGuard,
            AuthGuard
        ],
        data: {
            activityGuid: ActivityGuids.AboutYou
        }
    },
    {
        path: AppRoutes.AboutChild,
        component: ActivityPageRedesignedComponent,
        canActivate: [
            IrbGuard,
            AuthGuard
        ],
        data: {
            activityGuid: ActivityGuids.AboutChild
        }
    },
    {
        path: AppRoutes.ConsentAssent,
        component: ActivityPageRedesignedComponent,
        canActivate: [
            IrbGuard,
            AuthGuard
        ],
        data: {
            activityGuid: ActivityGuids.ConsentAssent
        }
    },
    {
        path: AppRoutes.ParentalConsent,
        component: ActivityPageRedesignedComponent,
        canActivate: [
            IrbGuard,
            AuthGuard
        ],
        data: {
            activityGuid: ActivityGuids.ParentalConsent
        }
    },
    {
        path: AppRoutes.ReleaseMinor,
        component: ActivityPageRedesignedComponent,
        canActivate: [
            IrbGuard,
            AuthGuard
        ],
        data: {
            activityGuid: ActivityGuids.ReleaseMinor
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
            activityGuid: ActivityGuids.Consent
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
            activityGuid: ActivityGuids.Release
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
        path: AppRoutes.StayInformed,
        component: StayInformedRedesignedComponent,
        canActivate: [
            IrbGuard
        ]
    },
    {
        path: AppRoutes.Error,
        component: ErrorRedesignedComponent
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
        path: AppRoutes.Data,
        component: DataComponent,
        canActivate: [
            IrbGuard
        ]
    },
    {
        path: AppRoutes.AboutUs,
        component: AboutUsComponent,
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
        path: AppRoutes.PasswordResetDone,
        component: RedirectToLoginLandingRedesignedComponent,
        canActivate: [
            IrbGuard
        ]
    },
    {
        path: AppRoutes.ThankYou,
        component: AgeUpThankYouComponent,
        canActivate: [
            IrbGuard
        ],
        data: {
            verify: true
        }
    },
    {
        path: AppRoutes.ProxyThankYou,
        component: AgeUpThankYouComponent,
        canActivate: [
            IrbGuard
        ],
        data: {
            collect: true
        }
    },
    {
        path: AppRoutes.Verify,
        component: VerifyAgeUpPageComponent,
        canActivate: [
            IrbGuard
        ]
    },
    {
        path: AppRoutes.Accept,
        component: AcceptAgeUpPageComponent,
        canActivate: [
            IrbGuard
        ]
    },
    {
        path: AppRoutes.MailingList,
        component: WelcomeComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.SessionExpired,
        component: SessionExpiredRedesignedComponent,
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
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
