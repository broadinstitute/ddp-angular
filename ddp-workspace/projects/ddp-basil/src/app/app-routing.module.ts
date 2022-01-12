import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    AdminAuthGuard,
    Auth0CodeCallbackComponent,
    AuthGuard,
    IrbGuard,
    ChangeLanguageRedirectComponent
} from 'ddp-sdk';

import {
    ActivityRedesignedComponent,
    AdminLoginLandingComponent,
    DashboardRedesignedComponent,
    ErrorRedesignedComponent,
    LoginLandingRedesignedComponent,
    PasswordRedesignedComponent,
    RedirectToAuth0LoginRedesignedComponent,
    RedirectToLoginLandingRedesignedComponent,
    SessionExpiredRedesignedComponent,
    WorkflowStartActivityRedesignedComponent
} from 'toolkit';

import { AppRoutes } from './app-routes';
import { PrismActivityLinkComponent } from './components/prism-activity-link/prism-activity-link.component';
import { PrismComponent } from './components/prism/prism.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full',
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.ActivityId,
        component: ActivityRedesignedComponent,
        canActivate: [IrbGuard, AuthGuard]
    },
    {
        path: AppRoutes.ActivityLinkId,
        component: ActivityRedesignedComponent,
        canActivate: [IrbGuard, AuthGuard]
    },
    {
        path: AppRoutes.AdminLoginLanding,
        component: AdminLoginLandingComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.AdminSessionExpired,
        component: SessionExpiredRedesignedComponent,
        canActivate: [IrbGuard],
        data: { isAdmin: true }
    },
    {
        path: AppRoutes.Dashboard,
        component: DashboardRedesignedComponent,
        canActivate: [IrbGuard, AuthGuard]
    },
    {
        path: AppRoutes.Error,
        component: ErrorRedesignedComponent
    },
    {
        path: AppRoutes.LanguageRedirect,
        component: ChangeLanguageRedirectComponent,
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
        path: AppRoutes.Password,
        component: PasswordRedesignedComponent
    },
    {
        path: AppRoutes.PasswordResetDone,
        component: RedirectToLoginLandingRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.Prequal,
        component: WorkflowStartActivityRedesignedComponent,
        canActivate: [IrbGuard]
    },
    {
        path: AppRoutes.Prism,
        component: PrismComponent,
        canActivate: [IrbGuard, AdminAuthGuard]
    },
    {
        path: AppRoutes.PrismActivityLink,
        component: PrismActivityLinkComponent,
        canActivate: [IrbGuard, AdminAuthGuard]
    },
    {
        path: AppRoutes.SessionExpired,
        component: SessionExpiredRedesignedComponent,
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
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
