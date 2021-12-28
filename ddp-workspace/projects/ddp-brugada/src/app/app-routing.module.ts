import { NgModule } from '@angular/core';
import { Route } from './constants/Route';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { TeamComponent } from './pages/team/team.component';
import { ErrorComponent } from './pages/error/error.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginLandingComponent } from './pages/login-landing/login-landing.component';
import { PasswordComponent } from './pages/password/password.component';
import { IrbGuard, BrowserGuard, Auth0CodeCallbackComponent } from 'ddp-sdk';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActivityPageComponent } from './pages/activity-page/activity-page.component';
import { AuthRedirectComponent } from './pages/auth-redirect/auth-redirect.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SessionExpiredComponent } from './pages/session-expired/session-expired.component';
import { AuthGuard } from './guards/auth.guard';

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
    path: Route.Dashboard,
    component: DashboardComponent,
    canActivate: [BrowserGuard, IrbGuard, AuthGuard],
  },
  {
    path: Route.ActivityId,
    component: ActivityPageComponent,
    canActivate: [BrowserGuard, IrbGuard, AuthGuard],
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
    path: Route.LoginLanding,
    component: LoginLandingComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLandingMode,
    component: AuthRedirectComponent,
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
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
