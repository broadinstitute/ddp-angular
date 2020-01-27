import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import {
  GoogleAnalyticsEventsService,
  GoogleAnalytics,
  WindowRef,
  Auth0AdapterService,
  SessionMementoService
} from 'ddp-sdk';
import { Router } from "@angular/router";

@Component({
    selector: 'toolkit-footer',
    template: `
      <footer class="Footer row">
      <div class="col-lg-6 col-md-4 col-sm-4 col-xs-12 Footer-logo NoPadding">
          <a href [routerLink]="['/home']">
              <img lazy-resource src="/assets/images/project-logo-dark.svg" [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
          </a>
      </div>
      <div class="col-lg-6 col-md-4 col-sm-8 col-xs-12 NoPadding">
        <p class="Footer-text Float--right">
            <a [routerLink]="['/']" class="Footer-link" translate>Toolkit.Common.Home</a>
            <span  (click)="clickLearnMore()" class="Footer-link" translate>Toolkit.Common.LearnMore</span>
            <span *ngIf="!isLoggedIn()"  (click)="clickJoinUs()" class="Footer-link" translate>Toolkit.Common.JoinUs</span>
            <span *ngIf="isLoggedIn()"  (click)="clickDashboard()" class="Footer-link" translate>Toolkit.Common.Dashboard</span>
            <ddp-sign-in-out class="Footer-link"></ddp-sign-in-out>
            <button (click)="goToTop()" class="Footer-link"><i class="fas fa-arrow-up Footer-arrow"></i><span translate>Toolkit.Footer.BackToTop</span></button>
        </p>
      </div>

              

</footer>
`
})
export class FooterComponent implements OnInit {
    constructor(
        private router: Router,
        private dialog: MatDialog,
        private analytics: GoogleAnalyticsEventsService,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        private auth0Adapter: Auth0AdapterService,
        private session: SessionMementoService) { }

    public ngOnInit(): void {
    }

    public goToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    public isLoggedIn(): boolean {
      return this.session.isAuthenticatedSession();
    }

    public clickDashboard(): void {
      if (this.isLoggedIn()){
        this.router.navigateByUrl('dashboard');
      }
    }

    public clickJoinUs(): void {
      if (!this.isLoggedIn()){
        sessionStorage.setItem('nextUrl', 'start-study');
        this.auth0Adapter.signup();
      }
    }

    public clickLearnMore(): void {
      this.router.navigateByUrl('/learn-more');
    }

    public doAnalytics(action: string): void {
        this.analytics.emitCustomEvent(GoogleAnalytics.Social, action);
    }
}
