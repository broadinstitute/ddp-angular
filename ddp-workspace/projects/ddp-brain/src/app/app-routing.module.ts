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
import { EndEnrollComponent } from './components/end-enroll/end-enroll.component';

const routes: Routes = [
    {
        path: AppRoutes.Error,
        component: ErrorRedesignedComponent
    },
    {
        path: AppRoutes.PasswordResetDone,
        component: RedirectToLoginLandingRedesignedComponent,
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
        path: '',
        component: EndEnrollComponent
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
