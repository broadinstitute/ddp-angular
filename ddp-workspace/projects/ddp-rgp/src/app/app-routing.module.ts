import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  UrlSegment,
  UrlMatchResult,
} from '@angular/router';

import { Routes as AppRoutes } from './routes';
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
import { StayInformedComponent } from './components/stay-informed/stay-informed.component';
import { ErrorComponent } from './components/error/error.component';
import { TellUsYourStoryComponent } from './components/tell-us-your-story/tell-us-your-story.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { Auth0LandingComponent } from './components/auth0-landing/auth0-landing.component';
import { Auth0RedirectComponent } from './components/auth0-redirect/auth0-redirect.component';
import { RedirectToAuth0Landing } from './components/redirect-to-auth0-landing/redirect-to-auth0-landing.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { EmailVerifiedCallbackComponent } from './components/email-verified-callback/email-verified-callback.component';
import { Auth0CodeCallbackComponent } from './components/auth0-code-callback/auth0-code-callback.component';
import { EmailVerificationRequiredComponent } from './components/email-verification-required/email-verification-required.component';
import { SurveyComponent } from './components/survey/survey.component';

import { IrbGuard, AuthGuard } from 'ddp-sdk';

// This matches "lgmd" case insensitively ("lgmd" and "LgMd" both match)
// The Angular compiler complains if you try to create a function that returns a generic version of
// this function where it case-insensitively matches the specified string
export function lgmdMatcher(url: UrlSegment[]): UrlMatchResult {
  return (url[0].path.toLowerCase() === 'lgmd'
    ? { consumed: url }
    : null) as UrlMatchResult;
}

const routes: Routes = [
  {
    path: AppRoutes.Home,
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard],
  },
  { matcher: lgmdMatcher,
    redirectTo: AppRoutes.LGMD },
  {
    path: AppRoutes.Auth,
    component: Auth0CodeCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.LoginLanding,
    component: Auth0LandingComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.LoginLandingMode,
    component: Auth0RedirectComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.PasswordResetDone,
    component: RedirectToAuth0Landing,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.SessionExpired,
    component: SessionExpiredComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.TellUsYourStory,
    component: TellUsYourStoryComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.AboutUs,
    component: AboutUsComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.Faq,
    component: FaqComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.EligibilityCriteria,
    component: EligibilityCriteriaComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.EmailVerificationRequired,
    component: EmailVerificationRequiredComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.EmailVerifiedCallback,
    component: EmailVerifiedCallbackComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.HowItWorks,
    component: HowItWorksComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.ThankYou,
    component: ThankYouComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.PrivacyAndYourData,
    component: PrivacyAndYourDataComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.ForYourPhysician,
    component: ForYourPhysicianComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.DataSharing,
    component: DataSharingComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.LGMD,
    component: LGMDComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.Craniofacial,
    component: CraniofacialComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.Password,
    component: PasswordComponent,
  },
  { path: AppRoutes.CountMeIn,
    redirectTo: AppRoutes.TellUsYourStory },
  {
    path: AppRoutes.StayInformed,
    component: StayInformedComponent,
    canActivate: [IrbGuard],
  },
  {
    path: AppRoutes.Error,
    component: ErrorComponent,
  },
  {
    path: AppRoutes.ActivityId,
    component: SurveyComponent,
    canActivate: [AuthGuard, IrbGuard],
  },
  {
    path: AppRoutes.ActivityLink,
    component: SurveyComponent,
    canActivate: [AuthGuard, IrbGuard],
  },
  {
    path: AppRoutes.Dashboard,
    component: UserDashboardComponent,
    canActivate: [AuthGuard, IrbGuard],
  },
  {
    path: '**',
    redirectTo: AppRoutes.Home,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
