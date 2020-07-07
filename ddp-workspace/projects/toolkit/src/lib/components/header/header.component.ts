import { Component, HostListener, Input, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { CommunicationService } from './../../services/communication.service';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { AnalyticsEventsService, BrowserContentService, WindowRef, AnalyticsEventCategories, AnalyticsEventActions } from 'ddp-sdk';

@Component({
    selector: 'toolkit-header',
    template: `
    <mat-toolbar class="Header"
                 [ngClass]="{'Header--scrolled': isScrolled, 'warning-message-top': unsupportedBrowser}">
    <div *ngIf="!(isMobile && stickySubtitle && isScrolled)"
          class="Header-logo"
          ngClass.xs="Header-logo--small"
          [ngClass.xs]="{'Header-logo--hide': stickySubtitle && isScrolled}">
        <a [routerLink]="['/']" class="Header-link">
            <img src="assets/images/project-logo.svg" class="Header-logoImg"
                 alt="Project isotype">
            <div class="Header-logoText"
                 [ngClass]="{'Header-logoText--Scrolled': isScrolled}"
                 [innerHTML]="'Toolkit.Header.HeaderLogo' | translate">
            </div>
        </a>
    </div>
    <div *ngIf="isScrolled && stickySubtitle" class="HeaderInfo" [ngClass]="{'HeaderInfo--scrolled': isScrolled && isMobile}">
        <div class="PageHeader-subTitle" [innerHTML]="stickySubtitle">
        </div>
    </div>
    <nav class="Header-nav" ngClass.xs="Header-nav--small">
        <ul class="Header-navList" ngClass.xs="Header-navList--small">
            <li class="Header-navItem">
              <ddp-language-selector [isScrolled]="isScrolled"></ddp-language-selector>
            </li>
            <li *ngIf="showButtons && showDataRelease" class="Header-navItem" fxShow="false" fxShow.gt-sm>
                <span [routerLink]="['/data-release']" class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" translate>
                    Toolkit.Header.DataRelease
                </span>
            </li>
            <li class="Header-navItem" fxShow="false" fxShow.gt-xs>
                <span (click)="openEvent()" class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" translate>
                    Toolkit.Header.LearnMore
                </span>
            </li>
            <li *ngIf="showUserMenu && !unsupportedBrowser" class="Header-navItem user-menu-header">
                <ddp-user-menu [isScrolled]="isScrolled">
                </ddp-user-menu>
            </li>
            <li *ngIf="showButtons" class="Header-navItem">
                <span [routerLink]="unsupportedBrowser ? null : '/count-me-in'"
                      (click)="clickCountMeIn()"
                      class="CountButton" [ngClass]="{'CountButton--Scrolled': isScrolled}" 
                      [innerHTML]="'Toolkit.Header.CountMeIn' | translate">
                </span>
            </li>
            <li class="Header-navItem" fxHide="false" fxHide.gt-xs>
                <span class="MenuButton">
                    <mat-icon (click)="openEvent()" class="MenuButton-Icon" [ngClass]="{'MenuButton-Icon--Scrolled': isScrolled}">menu
                    </mat-icon>
                </span>
            </li>
        </ul>
    </nav>
    </mat-toolbar>`
})
export class HeaderComponent implements OnInit {
    @Input() showButtons: boolean;
    @Input() showUserMenu = true;
    @Input() stickySubtitle: string;
    public isScrolled = false;
    public unsupportedBrowser: boolean;
    private HEADER_HEIGHT: number = this.isMobile ? 1 : 70;

    constructor(
        private communicationService: CommunicationService,
        private router: Router,
        private analytics: AnalyticsEventsService,
        private browserContent: BrowserContentService,
        private windowRef: WindowRef,
        @Inject(DOCUMENT) private document: any,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    @HostListener('window: scroll') public onWindowScroll(): void {
        const scrolledPixels = this.windowRef.nativeWindow.pageYOffset
            || this.document.documentElement.scrollTop
            || this.document.body.scrollTop || 0;
        if (scrolledPixels >= this.HEADER_HEIGHT) {
            this.isScrolled = true;
        } else if (scrolledPixels < this.HEADER_HEIGHT) {
            this.isScrolled = false;
        }
    }

    public openEvent(): void {
        this.windowRef.nativeWindow.scrollTo(0, 0);
        this.communicationService.openSidePanel();
    }

    public clickCountMeIn(): void {
        this.doAnalytics();
        if (this.unsupportedBrowser) {
            this.browserContent.emitWarningEvent();
        }
    }

    public get isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    public get showDataRelease(): boolean {
        return this.toolkitConfiguration.showDataRelease;
    }

    private doAnalytics(): void {
        (this.router.url.indexOf(this.toolkitConfiguration.moreDetailsUrl) > -1) ?
            this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromFAQ) :
            this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromHeader);
    }
}
