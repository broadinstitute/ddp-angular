import { NgModule } from '@angular/core';
import { Route } from './constants/Route';
import { Routes, RouterModule } from '@angular/router';
import { IrbGuard, BrowserGuard } from 'ddp-sdk';
import { ErrorComponent } from './pages/error/error.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { PasswordComponent } from './pages/password/password.component';
import { TeamComponent } from './pages/team/team.component';
import { AboutComponent } from './pages/about/about.component';
import { RegistrationComponent } from './pages/registration/registration.component';


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
    path: Route.Error,
    component: ErrorComponent,
    canActivate: [BrowserGuard, IrbGuard],
  },
  {
    path: Route.Password,
    component: PasswordComponent,
  },
  {
    path: Route.Join,
    component: RegistrationComponent
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
