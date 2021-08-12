import { NgModule } from '@angular/core';
import { Route } from './constants/Route';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './pages/faq/faq.component';
import { LoginLandingRedesignedComponent } from 'toolkit';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { TeamComponent } from './pages/team/team.component';
import { ErrorComponent } from './pages/error/error.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { PasswordComponent } from './pages/password/password.component';
import { IrbGuard, BrowserGuard, Auth0CodeCallbackComponent } from 'ddp-sdk';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SessionExpiredComponent } from './pages/session-expired/session-expired.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.About,
    component: AboutComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.Team,
    component: TeamComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.FAQ,
    component: FaqComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.Join,
    component: JoinComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.Error,
    component: ErrorComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordComponent,
  },
  {
    path: Route.Registration,
    component: RegistrationComponent
  },
  {
    path: Route.Login,
    component: LoginComponent
  },
  {
    path: Route.LoginLanding,
    component: LoginLandingRedesignedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.PasswordReset,
    component: ForgotPasswordComponent,
  },
  {
    path: Route.SessionExpired,
    component: SessionExpiredComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
