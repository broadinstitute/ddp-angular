import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { Auth0CodeCallbackComponent, BrowserGuard, IrbGuard } from 'ddp-sdk';
import {
    ErrorRedesignedComponent,
    LoginLandingRedesignedComponent,
    PasswordRedesignedComponent,
    RedirectToAuth0LoginRedesignedComponent,
    RedirectToLoginLandingRedesignedComponent,
    SessionExpiredRedesignedComponent,
    WorkflowStartActivityRedesignedComponent
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
