import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    Auth0CodeCallbackComponent,
    AuthGuard,
    IrbGuard,
    BrowserGuard,
    AdminAuthGuard
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
    ActivityLinkComponent,
    LovedOneThankYouComponent,
    RedirectToAuth0LoginComponent,
    AdminLoginLandingComponent
} from 'toolkit';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { PrismComponent } from './components/prism/prism.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EndEnrollComponent } from './components/end-enroll/end-enroll.component';

const routes: Routes = [
    {
        path: 'error',
        component: ErrorComponent
    },
    {
        path: 'data-release',
        component: DataReleaseComponent,
        canActivate: [IrbGuard]
    },
    {
        path: '',
        component: EndEnrollComponent,
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
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
