import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard } from 'ddp-sdk';
import {
    ActivityRedesignedComponent,
    DashboardRedesignedComponent,
    ErrorRedesignedComponent,
    LoginLandingRedesignedComponent,
    PasswordRedesignedComponent,
    RedirectToAuth0LoginRedesignedComponent,
    RedirectToLoginLandingRedesignedComponent,
    SessionExpiredRedesignedComponent,
    WorkflowStartActivityRedesignedComponent
} from 'toolkit';

import { AppRoutes } from './components/app-routes';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaqComponent } from './components/faq/faq.component';
import { ParticipationComponent } from './components/participation/participation.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ScientificResearchComponent } from './components/scientific-research/scientific-research.component';

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full',
        canActivate: [IrbGuard]
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
        path: AppRoutes.AboutUs,
        component: AboutUsComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.Participation,
        component: ParticipationComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.ScientificResearch,
        component: ScientificResearchComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.FAQ,
        component: FaqComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.LocalAuth,
        component: Auth0CodeCallbackComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.LoginLanding,
        component: LoginLandingRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.LoginLandingMode,
        component: RedirectToAuth0LoginRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.CountMeIn,
        component: WorkflowStartActivityRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard
        ]
    },
    {
        path: AppRoutes.ActivityId,
        component: ActivityRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ]
    },
    {
        path: AppRoutes.ActivityLinkId,
        component: ActivityRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard,
            AuthGuard
        ]
    },
    {
        path: AppRoutes.Error,
        component: ErrorRedesignedComponent
    },
    {
        path: AppRoutes.PasswordResetDone,
        component: RedirectToLoginLandingRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.SessionExpired,
        component: SessionExpiredRedesignedComponent,
        canActivate: [
            IrbGuard,
            BrowserGuard
        ]
    },
    {
        path: AppRoutes.Password,
        component: PasswordRedesignedComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 150] /* 150px to top when scrolling as to see full content */
};

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
