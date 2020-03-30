import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { PasswordComponent } from './components/password/password.component';
import { EligibilityCriteriaComponent } from './components/eligibility-criteria/eligibility-criteria.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PrivacyAndYourDataComponent } from './components/privacy-and-your-data/privacy-and-your-data.component';
import { ForYourPhysicianComponent } from './components/for-your-physician/for-your-physician.component';

import {
  IrbGuard
} from 'ddp-sdk';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'eligibility-criteria',
    component: EligibilityCriteriaComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'how-it-works',
    component: HowItWorksComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'privacy-and-your-data',
    component: PrivacyAndYourDataComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'for-your-physician',
    component: ForYourPhysicianComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'password',
    component: PasswordComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
