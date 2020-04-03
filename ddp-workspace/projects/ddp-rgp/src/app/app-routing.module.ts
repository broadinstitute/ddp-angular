import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlMatchResult } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { PasswordComponent } from './components/password/password.component';
import { EligibilityCriteriaComponent } from './components/eligibility-criteria/eligibility-criteria.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PrivacyAndYourDataComponent } from './components/privacy-and-your-data/privacy-and-your-data.component';
import { ForYourPhysicianComponent } from './components/for-your-physician/for-your-physician.component';
import { DataSharingComponent } from './components/data-sharing/data-sharing.component';
import { LGMDComponent } from './components/lgmd/lgmd.component';
import { CraniofacialComponent } from './components/craniofacial/craniofacial.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { StayInformedComponent } from './components/stay-informed/stay-informed.component';
import { ErrorComponent } from './components/error/error.component';
import { CountMeInComponent } from './components/count-me-in/count-me-in.component'
import { Auth0LandingComponent } from './components/auth0-landing/auth0-landing.component';
import { Auth0RedirectComponent } from './components/auth0-redirect/auth0-redirect.component';
import { RedirectToAuth0Landing } from './components/redirect-to-auth0-landing/redirect-to-auth0-landing.component';

import {
  IrbGuard,
  Auth0CodeCallbackComponent
} from 'ddp-sdk';

// This matches "lgmd" case insensitively ("lgmd" and "LgMd" both match)
// The Angular compiler complains if you try to create a function that returns a generic version of
// this function where it case-insensitively matches the specified string
export function lgmdMatcher(url: UrlSegment[]) {
  return <UrlMatchResult>(url[0].path.toLowerCase() === 'lgmd' ? ({ consumed: url }) : null);
}

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: 'auth',
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'login-landing',
    component: Auth0LandingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'login-landing/:mode',
    component: Auth0RedirectComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'password-reset-done',
    component: RedirectToAuth0Landing,
    canActivate: [IrbGuard]
  },
  {
    path: 'tell-us-your-story',
    component: CountMeInComponent,
    canActivate: [IrbGuard]
  },
  {
    matcher: lgmdMatcher,
    redirectTo: 'limb-girdle-muscular-dystrophy',
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
    path: 'data-sharing',
    component: DataSharingComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'limb-girdle-muscular-dystrophy',
    component: LGMDComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'craniofacial',
    component: CraniofacialComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'password',
    component: PasswordComponent
  },
  {
    path: 'count-me-in',
    redirectTo: 'tell-us-your-story',
    canActivate: [IrbGuard]
  },
  {
    path: 'thank-you',
    component: ThankYouComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'stay-informed',
    component: StayInformedComponent,
    canActivate: [IrbGuard]
  },
  {
    path: 'error',
    component: ErrorComponent,
    canActivate: [IrbGuard]
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
