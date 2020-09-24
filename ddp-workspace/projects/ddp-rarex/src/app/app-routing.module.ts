import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Auth0CodeCallbackComponent, AuthGuard, BrowserGuard, IrbGuard } from 'ddp-sdk';

import {
  DashboardRedesignedComponent,
  LoginLandingRedesignedComponent,
  PasswordRedesignedComponent,
} from 'toolkit';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { RarexActivityPageComponent } from './components/rarex-activity-page/rarex-activity-page.component';
import { ShareMyDataComponent } from './components/share-my-data/share-my-data.component';
import { RoutePaths } from './router-resources';

const routes: Routes = [
  {
    path: RoutePaths.Activities,
    component: RarexActivityPageComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RoutePaths.Dashboard,
    component: DashboardRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RoutePaths.ShareMyData,
    component: ShareMyDataComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: RoutePaths.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RoutePaths.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RoutePaths.Password,
    component: PasswordRedesignedComponent
  },
  {
      path: RoutePaths.Welcome,
      component: WelcomeComponent,
      pathMatch: 'full',
      canActivate: [IrbGuard]
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
