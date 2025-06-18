import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    Auth0CodeCallbackComponent,
    IrbGuard,
    BrowserGuard,
    ChangeLanguageRedirectComponent
} from 'ddp-sdk';

import {
    ErrorComponent,
    PasswordComponent,
    RedirectToLoginLandingComponent,
    SessionExpiredComponent
} from 'toolkit';

import { DataReleaseComponent } from './components/data-release/data-release.component';
import { EndEnrollComponent } from './components/end-enroll/end-enroll.component';

const routes: Routes = [
    {
        path: 'auth',
        component: Auth0CodeCallbackComponent,
        canActivate: [IrbGuard]
    },
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
        component: EndEnrollComponent
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
