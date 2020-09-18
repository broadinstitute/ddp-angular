import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IrbGuard } from 'ddp-sdk';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { RoutePaths } from './router-resources';

const routes: Routes = [
    {
        path: RoutePaths.Welcome,
        component: WelcomeComponent,
        pathMatch: 'full',
        // canActivate: [IrbGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes, {
        enableTracing: false,
        scrollPositionRestoration: 'top'
      })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
