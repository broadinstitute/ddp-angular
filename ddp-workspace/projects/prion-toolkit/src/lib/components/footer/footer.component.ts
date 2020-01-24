import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { JoinMailingListComponent } from './../dialogs/joinMailingList.component';
import { GoogleAnalyticsEventsService, GoogleAnalytics, WindowRef } from 'ddp-sdk';

@Component({
    selector: 'toolkit-footer',
    template: `
<footer class="Footer row">
  <div class="col-lg-6 col-md-4 col-sm-4 col-xs-12 Footer-logo NoPadding">
      <a href [routerLink]="['/home']">
          <img src="/assets/images/project-logo-dark.svg" [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
      </a>
  </div>
  <div class="col-lg-6 col-md-4 col-sm-8 col-xs-12 NoPadding">
    <p class="Footer-text Float--right">
        <a [routerLink]="['/']" class="Footer-link" translate>Toolkit.Footer.Home</a>
        <a [routerLink]="['/more-details']" class="Footer-link" translate>Toolkit.Footer.FAQ</a>
        <!--TODO: Add the other links-->
        <!--TODO: Figure out why footer arrow icon isn't showing up-->
        <button (click)="goToTop()" class="Footer-link"><i class="fa fa-arrow-up Footer-arrow"></i><span translate>Toolkit.Footer.Top</span></button>
    </p>
  </div>

              

</footer>
`
})
export class FooterComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private analytics: GoogleAnalyticsEventsService,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
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
        this.analytics.emitCustomEvent(GoogleAnalytics.Social, action);
    }
}
