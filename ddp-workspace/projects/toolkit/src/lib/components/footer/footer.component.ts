import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { JoinMailingListComponent } from './../dialogs/joinMailingList.component';
import { AnalyticsEventsService, AnalyticsEvents, WindowRef } from 'ddp-sdk';

@Component({
    selector: 'toolkit-footer',
    template: `<footer class="Footer">
  <div class="Footer-navigation">
      <a class="Footer-logo" [routerLink]="['/']">
          <img lazy-resource src="assets/images/project-logo.svg" class="Footer-logoImg" alt="Project isotype">
          <div class="Footer-logoText" [innerHTML]="'Toolkit.Footer.FooterLogo' | translate">
          </div>
      </a>
      <nav class="Footer-nav">
          <ul class="Footer-navList">
              <li class="Footer-navItem Footer-navItem--first">
                  <a [routerLink]="['/']" class="Footer-navItemLink" translate>Toolkit.Footer.Home</a>
              </li>
              <li *ngIf="showDataRelease" class="Footer-navItem">
                  <a [routerLink]="['/data-release']" class="Footer-navItemLink" translate>Toolkit.Footer.Data</a>
              </li>
              <li class="Footer-navItem">
                  <a [routerLink]="['/more-details']" class="Footer-navItemLink" translate>Toolkit.Footer.FAQ</a>
              </li>
              <li class="Footer-navItem">
                  <a [routerLink]="['/about-us']" class="Footer-navItemLink" translate>Toolkit.Footer.About</a>
              </li>
              <li *ngIf="showBlog" class="Footer-navItem">
                  <a [href]="blogUrl" class="Footer-navItemLink" translate>Toolkit.Footer.NewsBlog</a>
              </li>
              <li class="Footer-navItem">
                  <span (click)="openJoinDialog()" class="Footer-navItemLink" translate>Toolkit.Footer.Join</span>
              </li>
              <li *ngIf="showInfoForPhysicians" class="Footer-navItem">
                  <a [routerLink]="['physician.pdf']" target="_blank" class="Footer-navItemLink" translate>Toolkit.Footer.Info</a>
              </li>
              <li class="Footer-navItem">
                  <span (click)="goToTop()" class="Footer-navItemLink" translate>Toolkit.Footer.Top</span>
              </li>
          </ul>
          <div class="Footer-contact">
          <div>
              <ul class="Footer-contactList">
                  <li translate>Toolkit.Footer.Contacts.ContactUs</li>
                  <li>
                      <a [href]="emailHref" class="Footer-contactLink">{{ email }}</a>
                  </li>
                  <li>
                      <a [href]="phoneHref" class="Footer-contactLink">{{ phone }}</a>
                  </li>
                  <li>
                      <a target="_blank" [href]="facebookUrl" (click)="doAnalytics('facebook')">
                          <img lazy-resource class="Footer-contactLogos" src="assets/images/facebook.svg" alt="Facebook">
                      </a>
                      <a target="_blank" [href]="twitterUrl" (click)="doAnalytics('twitter')">
                          <img lazy-resource class="Footer-contactLogos" src="assets/images/twitter.svg" alt="Twitter">
                      </a>
                  </li>
              </ul>
          </div>
          <div>
              <ul class="Footer-contactList Footer-contactList--right">
                  <li>
                      <br>
                  </li>
                  <li translate>Toolkit.Common.Organization</li>
                  <li translate>Toolkit.Footer.Contacts.Address</li>
                  <li translate>Toolkit.Footer.Contacts.Zip</li>
              </ul>
          </div>
      </div>
      </nav>
      <a class="Footer-logoCMI" target="_blank" [href]="countMeInUrl">
            <img lazy-resource class="Footer-logoCMI-img" src="assets/images/logo-count-me-in.svg" alt="Count Me In logo">
      </a>
  </div>
</footer>`
})
export class FooterComponent implements OnInit {
    public phone: string;
    public email: string;
    public phoneHref: string;
    public emailHref: string;
    public facebookUrl: string;
    public twitterUrl: string;
    public countMeInUrl: string;
    public blogUrl: string;

    constructor(
        private dialog: MatDialog,
        private analytics: AnalyticsEventsService,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.phone = this.toolkitConfiguration.phone;
        this.email = this.toolkitConfiguration.infoEmail;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
        this.blogUrl = this.toolkitConfiguration.blogUrl;
    }

    public goToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    public openJoinDialog(): void {
        this.dialog.open(JoinMailingListComponent, {
            width: '740px',
            position: { top: '30px' },
            data: {},
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy()
        });
    }

    public doAnalytics(action: string): void {
        this.analytics.emitCustomEvent(AnalyticsEvents.Social, action);
    }

    public get showDataRelease(): boolean {
        return this.toolkitConfiguration.showDataRelease;
    }

    public get showInfoForPhysicians(): boolean {
        return this.toolkitConfiguration.showInfoForPhysicians;
    }

    public get showBlog(): boolean {
        return this.toolkitConfiguration.showBlog;
    }
}
