import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,

  BrowserGuard, IrbGuard
} from 'ddp-sdk';
import {
  ErrorRedesignedComponent,
  PasswordRedesignedComponent,
  RedirectToAuth0LoginComponent,
  RedirectToLoginLandingRedesignedComponent,
  SessionExpiredRedesignedComponent
} from 'toolkit';
import { AboutInitiativeComponent } from './components/about-initiative/about-initiative';
import { AboutUsComponent } from './components/about-us/about-us';
import { AccountActivatedComponent } from './components/account-activation/accountActivated';
import { AccountActivationRequiredComponent } from './components/account-activation/accountActivationRequired';
import { ConsoleComponent } from './components/console/console';
import { DashBoardComponent } from './components/dashboard/dashboard';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { DataAccessComponent } from './components/data-access/data-access';
import { JoinUsComponent } from './components/join-us/join-us';
import { StatisticsComponent } from './components/statistics/statistics';
import { WelcomeComponent } from './components/welcome/welcome';
import * as RouterResource from './router-resources';
import { AtcpAuth0CodeCallbackComponent } from './sdk/login/atcp-auth0-code-callback.component';
import { AtcpLoginLandingRedesignedComponent } from './toolkit/login/atcp-login-landing-redesigned.component';

const routes: Routes = [
  {
      path: RouterResource.Error,
      component: ErrorRedesignedComponent,
      canActivate: [IrbGuard]
  },
  {
      path: RouterResource.Statistics,
      component: StatisticsComponent,
      canActivate: [
        IrbGuard,
        BrowserGuard,
        AuthGuard
      ]
  },
  {
    path: RouterResource.Dashboard,
    component: DashBoardComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RouterResource.ParticipantList,
    component: ParticipantListComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard,
    ]
  },
  {
    path: RouterResource.PasswordResetDone,
    component: RedirectToLoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.SessionExpired,
    component: SessionExpiredRedesignedComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: RouterResource.LoginLanding,
    component: AtcpLoginLandingRedesignedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.LoginLandingMode,
    component: RedirectToAuth0LoginComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Auth,
    component: AtcpAuth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Password,
    component: PasswordRedesignedComponent
  },
  {
    path: RouterResource.DataAccess,
    component: DataAccessComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.AboutInitiative,
    component: AboutInitiativeComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.AboutUs,
    component: AboutUsComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.JoinUs,
    component: JoinUsComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Welcome,
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.Console,
    component: ConsoleComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard,
      AuthGuard
    ]
  },
  {
    path: RouterResource.AccountActivated,
    component: AccountActivatedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: RouterResource.AccountActivationRequired,
    component: AccountActivationRequiredComponent,
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
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
