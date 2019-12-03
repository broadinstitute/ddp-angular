import { Component, Inject, HostListener, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRef, SessionMementoService } from 'ddp-sdk';

@Component({
    selector: 'toolkit-redesigned-header',
    template: `
    <header class="header" [ngClass]="{'panel-opened': isPanelOpened, 'header_shadow': isPageScrolled}">
        <div class="header-content" [ngClass]="{'header-content_sticky': stickySubtitle}">
            <a class="project-logo" routerLink="/">
                <img class="project-logo__img" src="assets/images/logo.svg" [alt]="'Header.Logo.Image.Alt' | translate">
                <p class="project-logo__text" [innerHTML]="'Header.Logo.Title' | translate"></p>
            </a>
            <div *ngIf="stickySubtitle || showBreadcrumbs" class="activity-heading">
                <div *ngIf="showBreadcrumbs" class="breadcrumbs">Here should be shown Breadcrumbs component</div>
                <div *ngIf="stickySubtitle" class="sticky" [innerHTML]="stickySubtitle"></div>
            </div>
            <ng-container *ngTemplateOutlet="controls"></ng-container>
            <button class="hamburger hamburger--slider"
                    [ngClass]="{'is-active': isPanelOpened}"
                    [attr.aria-label]="'Common.Buttons.HeaderMenu.AriaLabel' | translate"
                    (click)="menuHandler()">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>
        </div>
        <div class="panel-controls">
            <ng-container *ngTemplateOutlet="controls"></ng-container>
        </div>
    </header>
    <div class="placeholder" [ngClass]="{'placeholder_opened': isPanelOpened}"></div>

    <ng-template #controls>
        <nav *ngIf="showMainButtons" class="nav">
            <ul class="navigation">
                <li *ngIf="isAuthenticated" class="navigation__item">
                    <ng-container *ngTemplateOutlet="dashboardButton"></ng-container>
                </li>
                <li class="navigation__item">
                    <a class="header-link" routerLink="/more-details" routerLinkActive="header-link_active" translate>
                        Header.Navigation.FAQ
                    </a>
                </li>
                <li class="navigation__item">
                    <a class="header-link" routerLink="/about-us" routerLinkActive="header-link_active" translate>
                        Header.Navigation.AboutUs
                    </a>
                </li>
                <li class="navigation__item">
                    <button class="SimpleButton"
                            [attr.aria-label]="'Common.Buttons.MailingList.AriaLabel' | translate"
                            (click)="openJoinMailingList()"
                            translate>
                            Common.Buttons.MailingList.Title
                    </button>
                </li>
                <li class="navigation__item">
                    <a class="header-link" [routerLink]="['/physician.pdf']" target="_blank" translate>
                        Header.Navigation.ForPhysicians
                    </a>
                </li>
            </ul>
        </nav>
        <div class="auth">
            <div *ngIf="isAuthenticated && showDashboardButton" class="auth__dashboard">
                <ng-container *ngTemplateOutlet="dashboardButton"></ng-container>
            </div>
            <div *ngIf="showLoginButton" class="auth__login header-link"
                 [ngClass]="{'header-button': !showMainButtons}">
                <ddp-sign-in-out></ddp-sign-in-out>
            </div>
            <a *ngIf="!isAuthenticated && showCmiButton" routerLink="/count-me-in" class="button button_small button_primary header-button"
               [ngClass]="{'button_medium': isPanelOpened}">
                <span translate>Common.Buttons.CountMeIn</span>
            </a>
        </div>
    </ng-template>

    <ng-template #dashboardButton>
        <a class="header-link" routerLink="/dashboard" routerLinkActive="header-link_active">
            <div class="header-link__dashboard">
                <svg class="dashboard-icon" width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                        <g class="dashboard-icon_color" transform="translate(-385.000000, -41.000000)" stroke="#000000" stroke-width="1.5">
                            <g transform="translate(386.000000, 40.000000)">
                                <g transform="translate(0.000000, 2.000000)">
                                    <circle cx="10" cy="8.125" r="4.375"></circle>
                                    <path d="M15.7608333,17.3966667 C14.2362899,15.8625492 12.1628105,14.9998815 10,14.9998815 C7.83718949,14.9998815 5.76371015,15.8625492 4.23916667,17.3966667"></path>
                                    <circle cx="10" cy="10" r="9.375"></circle>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
            <span translate>Header.Navigation.Dashboard</span>
        </a>
    </ng-template>`
})
export class HeaderRedesignedComponent {
    @Input() public showMainButtons = true; // Hides or shows FAQ, About Us, Mailing List, For Physicians buttons
    @Input() public showLoginButton = true;
    @Input() public showCmiButton = true;
    @Input() public showDashboardButton = false;
    @Input() public showBreadcrumbs = false;
    @Input() public stickySubtitle = '';
    public isPanelOpened = false;
    public isPageScrolled = false;

    constructor(
        private session: SessionMementoService,
        private window: WindowRef,
        @Inject(DOCUMENT) private document: any) { }

    public menuHandler(): void {
        this.isPanelOpened = !this.isPanelOpened;
    }

    public openJoinMailingList(): void {
        alert('Sorry, dialog not implemented yet');
    }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }

    @HostListener('window: scroll') public onWindowScroll(): void {
        const scrolledPixels = this.window.nativeWindow.pageYOffset
            || this.document.documentElement.scrollTop
            || this.document.body.scrollTop || 0;
        this.isPageScrolled = !!scrolledPixels;
    }
}
