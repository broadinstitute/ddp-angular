import { Component, HostListener, Input, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { CommunicationService } from './../../services/communication.service';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { GoogleAnalyticsEventsService, GoogleAnalytics, BrowserContentService, WindowRef, Auth0AdapterService } from 'ddp-sdk';
import {FlexModule} from '@angular/flex-layout';

@Component({
  selector: 'toolkit-header',
  template: `
    <header class="Header">
        <nav class="navbar navbar-default Header-background" [ngClass]="{'NoBackground': noBackground, 'Header--home': currentRoute === '/home' || currentRoute === '/'}">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed Header-hamburger" data-toggle="collapse" data-target="#menu" aria-expanded="false">
                    <span class="sr-only"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="Header-logo" href [routerLink]="['/home']">
                    <img src="/assets/images/project-logo.svg" alt="Prion Registry Logo">
                </a>
            </div>
            
            <div class="collapse navbar-collapse Header-collapse" id="menu">
                <ul class="nav navbar-nav navbar-right NoMargin">
                    <li *ngIf="isConsented()" class="Nav-item">
                        <span (click)="clickDashboard()" id="Dashboard" class="Nav-itemLink" [ngClass]="{'Nav-itemLink--active': currentRoute == '/dashboard'}">
                            Dashboard
                        </span>
                    </li>
                    <li class="Nav-item">
                        <span (click)="clickLearnMore()" id="Learn More" class="Nav-itemLink" [ngClass]="{'Nav-itemLink--active': currentRoute == '/more-details'}">
                            Learn More
                        </span>
                    </li>
                    <li class="Nav-item">
                        <span id="Sign In Out" class="Nav-itemLink">
                            <ddp-sign-in-out></ddp-sign-in-out>
                        </span>
                    </li>
                    <li *ngIf="!isLoggedIn()" class="Nav-item Nav-itemJoinUs">
                        <a (click)="clickJoinUs()" id="JoinUs" class="Button Button--secondaryWhite">
                            Join Us
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

  constructor(
    private router: Router,
    private analytics: GoogleAnalyticsEventsService,
    private browserContent: BrowserContentService,
    private windowRef: WindowRef,
    @Inject(DOCUMENT) private document: any,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
    private auth0Adapter: Auth0AdapterService) { }

  public ngOnInit(): void {
  }

  public isConsented(): boolean {
    //TODO: Return true when consented
    return false;
  }

  public isLoggedIn(): boolean {
    //TODO: Return true when logged in
    return false;
  }

  public clickDashboard(): void {
    if (this.isLoggedIn()){
      this.router.navigateByUrl('dashboard');
    }
  }

  public clickJoinUs(): void {
    if (!this.isLoggedIn()){
      sessionStorage.setItem('nextUrl', 'account-verification');
      this.auth0Adapter.signup();
    }
  }

  public clickSignIn(): void {
    if (!this.isLoggedIn()){
      this.auth0Adapter.login();
    }
  }

  public clickSignOut(): void {
    if (this.isLoggedIn()){
      this.auth0Adapter.logout(); //TODO: Direct somewhere?
    }
  }

  public clickLearnMore(): void {
    this.router.navigate(['/more-details']);
  }
}
