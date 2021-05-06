import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { Route } from './constants/route';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: Route.LearnMore,
    component: LearnMoreComponent,
    pathMatch: 'full',
  },
  {
    path: Route.StayInformed,
    component: StayInformedComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: Route.Home,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
