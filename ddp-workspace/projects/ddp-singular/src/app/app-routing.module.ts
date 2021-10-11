import { NgModule } from '@angular/core';
import { Route } from './constants/route';
import { RouterModule, Routes } from '@angular/router';
import { LoginLandingRedesignedComponent } from 'toolkit';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { SurveyComponent } from './components/pages/survey/survey.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { IrbGuard, Auth0CodeCallbackComponent, AuthGuard, BrowserGuard } from 'ddp-sdk';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { ParticipantsListComponent } from './components/pages/participant-list/participant-list.component';


const routes: Routes = [
  {
    path: Route.Home,
    redirectTo: Route.About,
    pathMatch: 'full'
  },
  {
    path: Route.PreScreening,
    component: PreScreeningComponent,
    canActivate: [IrbGuard],
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
    path: Route.Error,
    component: ErrorComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginRedirect,
    component: RedirectToLoginComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.About,
    component: AboutUsComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordComponent,
  },
  {
    path: Route.ActivityId,
    component: ActivityPageComponent,
    canActivate: [IrbGuard, AuthGuard],
  },
  {
    path: Route.SessionExpired,
    component: SessionExpiredComponent,
  },
  {
    path: Route.ParticipantList,
    component: ParticipantsListComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard]
  },
  {
    path: Route.Survey,
    component: SurveyComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
