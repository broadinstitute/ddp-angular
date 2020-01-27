import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import {
  Auth0AdapterService,
  BrowserContentService,
  GoogleAnalyticsEventsService,
  SessionMementoService,
  WindowRef
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-header',
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
export class HeaderComponent implements OnInit {
  @Input() noBackground = false;
  public unsupportedBrowser: boolean;

  constructor(
    private router: Router,
    private analytics: GoogleAnalyticsEventsService,
    private browserContent: BrowserContentService,
    private windowRef: WindowRef,
    @Inject(DOCUMENT) private document: any,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
    private auth0Adapter: Auth0AdapterService,
    private session: SessionMementoService) { }

  public ngOnInit(): void {
    this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
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
}
