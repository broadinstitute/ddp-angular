import { NgModule } from '@angular/core';
import { Route } from './constants/route';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesResolver } from './resolvers/activities.resolver';
import { HomeComponent } from './components/pages/home/home.component';
import { Auth0CodeCallbackComponent, AuthGuard, IrbGuard } from 'ddp-sdk';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { LoginLandingRedesignedComponent, RedirectToAuth0LoginRedesignedComponent } from 'toolkit';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';


const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.AboutUs,
    component: AboutUsComponent,
    pathMatch: 'full',
  },
  {
    path: Route.LearnMore,
    component: LearnMoreComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.StayInformed,
    component: StayInformedComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordComponent,
  },
  {
    path: Route.PreScreening,
    component: PreScreeningComponent,
    canActivate: [IrbGuard],
  },
  {
    path: Route.LoginLandingMode,
    component: RedirectToAuth0LoginRedesignedComponent,
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
    path: Route.Dashboard,
    component: DashboardComponent,
    resolve: {
      activities: ActivitiesResolver
    },
    canActivate: [IrbGuard, AuthGuard],
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
    path: '**',
    redirectTo: Route.Home,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
