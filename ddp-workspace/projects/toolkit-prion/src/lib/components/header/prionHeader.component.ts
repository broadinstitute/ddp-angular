import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  AnalyticsEventsService,
  Auth0AdapterService,
  BrowserContentService,
  SessionMementoService,
  WindowRef
} from 'ddp-sdk';
import { CommunicationService, HeaderComponent, ToolkitConfigurationService } from "toolkit";

@Component({
  selector: 'prion-header',
  template: `
    <header class="Header">
      <nav class="navbar navbar-default Header-background" [ngClass]="{'NoBackground': noBackground}">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed Header-hamburger" data-toggle="collapse" data-target="#menu" aria-expanded="false">
            <span class="sr-only"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="Header-logo" href [routerLink]="['/home']">
            <img lazy-resource src="/assets/images/project-logo.svg" [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
          </a>
        </div>

        <div class="collapse navbar-collapse Header-collapse" id="menu">
          <ul class="nav navbar-nav navbar-right NoMargin">
            <li class="Nav-item">
              <ddp-language-selector></ddp-language-selector>
            </li>
            <li *ngIf="isLoggedIn()" class="Nav-item">
                        <span (click)="clickDashboard()" id="Dashboard" class="Nav-itemLink" [ngClass]="{'Nav-itemLink--active': currentRoute == '/dashboard'}" translate>
                            Toolkit.Common.Dashboard
                        </span>
            </li>
            <li class="Nav-item">
                        <span (click)="clickLearnMore()" id="Learn More" class="Nav-itemLink" [ngClass]="{'Nav-itemLink--active': currentRoute == '/learn-more'}" translate>
                            Toolkit.Common.LearnMore
                        </span>
            </li>
            <li class="Nav-item">
                        <span id="Sign In Out" class="Nav-itemLink">
                            <ddp-sign-in-out></ddp-sign-in-out>
                        </span>
            </li>
            <li *ngIf="!isLoggedIn()" class="Nav-item Nav-item-JoinUs">
              <a (click)="clickJoinUs()" id="JoinUsLink" class="Button Button--secondaryWhite" translate>
                Toolkit.Common.JoinUs
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  `
})
export class PrionHeaderComponent extends HeaderComponent implements OnInit {
  @Input() showButtons = false;
  public isScrolled = false;
  public unsupportedBrowser: boolean;
  @Input() noBackground = false;
  @Input() currentRoute: string = '';

  constructor(
    private _communicationService: CommunicationService,
    private _router: Router,
    private _analytics: AnalyticsEventsService,
    private _browserContent: BrowserContentService,
    private _windowRef: WindowRef,
    @Inject(DOCUMENT) private _document: any,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService,
    private _auth0Adapter: Auth0AdapterService,
    private _session: SessionMementoService) {
    super(_communicationService, _router, _analytics, _browserContent, _windowRef, _document, _toolkitConfiguration);
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
