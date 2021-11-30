import { NgModule } from '@angular/core';
import { Route } from './constants/route';
import { RouterModule, Routes } from '@angular/router';
import { LoginLandingRedesignedComponent } from 'toolkit';
import { FaqComponent } from './components/pages/faq/faq.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { SurveyComponent } from './components/pages/survey/survey.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { IrbGuard, Auth0CodeCallbackComponent, AuthGuard, BrowserGuard } from 'ddp-sdk';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { ParticipantsListComponent } from './components/pages/participant-list/participant-list.component';
import { AcceptAgeUpComponent } from './components/pages/accept-age-up/accept-age-up.component';
import { VerifyAgeUpComponent } from './components/pages/verify-age-up/verify-age-up.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ForResearchesComponent } from './components/pages/for-researches/for-researches.component';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
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
    path: Route.SessionExpired,
    component: SessionExpiredComponent,
  },
  {
    path: Route.AcceptAgeUp,
    component: AcceptAgeUpComponent,
    canActivate: [IrbGuard, BrowserGuard],
  },
  {
    path: Route.VerifyAgeUp,
    component: VerifyAgeUpComponent,
    canActivate: [IrbGuard, BrowserGuard],
  },
  {
    path: Route.ParticipantList,
    component: ParticipantsListComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: Route.ActivityId,
    component: SurveyComponent,
    canActivate: [IrbGuard, BrowserGuard, AuthGuard],
  },
  {
    path: Route.FAQ,
    component: FaqComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.ForResearchers,
    component: ForResearchesComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.Dashboard,
    redirectTo: Route.ParticipantList,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
