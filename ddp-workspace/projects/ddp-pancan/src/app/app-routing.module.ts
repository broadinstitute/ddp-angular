import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { Auth0CodeCallbackComponent, BrowserGuard, IrbGuard } from 'ddp-sdk';
import {
  ErrorComponent,
  LoginLandingComponent,
  PasswordComponent,
  RedirectToAuth0LoginComponent,
  RedirectToLoginLandingComponent,
  SessionExpiredComponent,
  WorkflowStartActivityComponent
} from 'toolkit';
import { AppRoutes } from './components/app-routes';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: AppRoutes.LocalAuth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: AppRoutes.LoginLanding,
    component: LoginLandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: AppRoutes.LoginLandingMode,
    component: RedirectToAuth0LoginComponent,
    canActivate: [IrbGuard]
  },
  {
    path: AppRoutes.CountMeIn,
    component: WorkflowStartActivityComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: AppRoutes.Error,
    component: ErrorComponent
  },
  {
    path: AppRoutes.PasswordResetDone,
    component: RedirectToLoginLandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: AppRoutes.SessionExpired,
    component: SessionExpiredComponent,
    canActivate: [
      IrbGuard,
      BrowserGuard
    ]
  },
  {
    path: AppRoutes.Password,
    component: PasswordComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
