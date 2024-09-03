import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    IrbGuard,
} from 'ddp-sdk';

import { DataReleaseComponent } from './components/data-release/data-release.component';
import { EndEnrollComponent } from './components/end-enroll/end-enroll.component';

const routes: Routes = [
    {
        path: 'data-release',
        component: DataReleaseComponent,
        canActivate: [IrbGuard]
    },
    {
        path: '',
        component: EndEnrollComponent,
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
