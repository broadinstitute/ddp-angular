import { IrbGuard } from 'ddp-sdk';
import { NgModule } from '@angular/core';
import { Route } from './constants/Route';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { AboutComponent } from './pages/about/about.component';
import { RegistrationComponent } from './pages/registration/registration.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [],
  },
  {
    path: Route.About,
    component: AboutComponent,
    canActivate: [],
  },
  {
    path: Route.Team,
    component: TeamComponent,
    canActivate: [],
  },
  {
    path: Route.FAQ,
    component: FaqComponent,
    canActivate: [],
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
