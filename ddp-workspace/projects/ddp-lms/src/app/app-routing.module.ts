import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ForYourPhysicianComponent } from './pages/for-your-physician/for-your-physician.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToParticipateComponent } from './pages/how-to-participate/how-to-participate.component';
import { ScientificImpactComponent } from './pages/scientific-impact/scientific-impact.component';
import { Route } from './constants/Route';

const routes: Routes = [
  {
    path: Route.Home,
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: Route.About,
    component: AboutComponent,
  },
  {
    path: Route.FAQ,
    component: FaqComponent,
  },
  {
    path: Route.ForYourPhysician,
    component: ForYourPhysicianComponent,
  },
  {
    path: Route.HowToParticipate,
    component: HowToParticipateComponent,
  },
  {
    path: Route.ScientificImpact,
    component: ScientificImpactComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
