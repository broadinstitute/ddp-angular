import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SilentRenewComponent } from './silentRenew.component';

import { ActivityComponent } from './activity.component';
import { ConsentComponent } from './consent.component';
import { WelcomeComponent } from './welcome.component';
import { PrequalifierComponent } from './prequalifier.component';
import { DashboardComponent } from './dashboard.component';
import { NotQualifiedComponent } from './notQualified.component';
import { ConsentDeclinedComponent } from './consentDeclined.component';
import { LoginLandingComponent } from './loginLanding.component';

import {
  DdpModule,
  ConfigurationService,
  LogLevel,
  Auth0CodeCallbackComponent,
  AuthGuard
} from 'ddp-sdk';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ScaffoldComponent } from './scaffold.component';
import { UserStateService } from './services/userState.service';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare let DDP_ENV: any;

export let config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = 'TESTSTUDY1';
config.logLevel = LogLevel.Info;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = location.origin + base + 'silentRenew';
config.loginLandingUrl = location.origin + base + 'login-landing';
config.auth0CodeRedirect = location.origin + base + 'auth';
config.localRegistrationUrl = config.backendUrl + '/pepper/v1/register';
config.doLocalRegistration = DDP_ENV.doLocalRegistration;
config.mapsApiKey = DDP_ENV.mapsApiKey;
config.auth0Audience = DDP_ENV.auth0Audience;
config.projectGAToken = DDP_ENV.projectGAToken;

const appRoutes: Routes = [
  { path: 'prequalifier', component: PrequalifierComponent, canActivate: [AuthGuard] },
  { path: 'consent', component: ConsentComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'silentRenew', component: SilentRenewComponent },
  { path: 'not-qualified', component: NotQualifiedComponent, canActivate: [AuthGuard] },
  { path: 'consent-declined', component: ConsentDeclinedComponent, canActivate: [AuthGuard] },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'auth', component: Auth0CodeCallbackComponent },
  { path: 'activity', component: ActivityComponent, canActivate: [AuthGuard] },
  { path: 'login-landing', component: LoginLandingComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome' }
];

declare let ga: Function;

@NgModule({
  declarations: [
    AppComponent,
    SilentRenewComponent,
    ActivityComponent,
    ConsentComponent,
    WelcomeComponent,
    PrequalifierComponent,
    ScaffoldComponent,
    DashboardComponent,
    NotQualifiedComponent,
    ConsentDeclinedComponent,
    LoginLandingComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    BrowserModule,
    DdpModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCardModule,
    MatGridListModule, MatInputModule, MatRadioModule, MatSidenavModule, MatProgressSpinnerModule,
    FormsModule, FlexLayoutModule
  ],
  providers: [
    { provide: 'ddp.config', useValue: config },
    UserStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
