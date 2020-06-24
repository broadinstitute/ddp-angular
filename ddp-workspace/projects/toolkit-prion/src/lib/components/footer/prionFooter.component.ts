import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AnalyticsEventsService,
  Auth0AdapterService,
  SessionMementoService,
  WindowRef
} from 'ddp-sdk';
import { Router } from "@angular/router";
import { FooterComponent, ToolkitConfigurationService } from "toolkit";

@Component({
  selector: 'prion-footer',
  template: `
    <footer class="Footer row">
      <div class="col-lg-6 col-md-4 col-sm-4 col-xs-12 Footer-left">
        <a href [routerLink]="['/home']">
          <img lazy-resource src="/assets/images/project-logo-dark.svg" [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
        </a>
        <p class="Footer-contact">
          <span translate>Toolkit.Footer.ContactUs</span>
          <a [href]="'Toolkit.Footer.ContactMailTo' | translate" class="Footer-link NoPadding" translate>Toolkit.Footer.ContactEmail</a>
        </p>
      </div>
      <div class="col-lg-6 col-md-4 col-sm-8 col-xs-12 Footer-links">
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
export class PrionFooterComponent extends FooterComponent implements OnInit {
  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _analytics: AnalyticsEventsService,
    private _windowRef: WindowRef,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService,
    private _auth0Adapter: Auth0AdapterService,
    private _session: SessionMementoService) {
    super(_dialog, _analytics, _windowRef, _toolkitConfiguration);
  }

  public isLoggedIn(): boolean {
    return this._session.isAuthenticatedSession();
  }

  public clickDashboard(): void {
    if (this.isLoggedIn()){
      this._router.navigateByUrl('dashboard');
    }
  }

  public clickJoinUs(): void {
    if (!this.isLoggedIn()){
      sessionStorage.setItem('nextUrl', 'start-study');
      this._auth0Adapter.signup();
    }
  }

  public clickLearnMore(): void {
    this._router.navigateByUrl('/learn-more');
  }
}
