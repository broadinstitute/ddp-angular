import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from './constants/route';
import { HomeComponent } from './components/pages/home/home.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';


const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
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
  },
  {
    path: Route.Error,
    component: ErrorComponent,
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
