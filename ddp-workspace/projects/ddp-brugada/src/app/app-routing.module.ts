import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IrbGuard, BrowserGuard } from 'ddp-sdk';

import { Route } from './constants/Route';
import { AboutComponent } from './pages/about/about.component';
import { ErrorComponent } from './pages/error/error.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { PasswordComponent } from './pages/password/password.component';
import { TeamComponent } from './pages/team/team.component';

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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
