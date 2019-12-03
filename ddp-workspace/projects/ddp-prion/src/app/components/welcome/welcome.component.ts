import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService, BrowserContentService, WindowRef } from 'ddp-sdk';

@Component({
    selector: 'welcome',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
    <div class="Wrapper">
        <a id="topView"></a>
        <div class="Intro-image">
            <div class="Intro-imageSpan" role="img" aria-label="Angiosarcoma Homepage Image">
                <span class="Intro-imageInner"></span>
                <div *ngIf="showArrow" class="Intro-arrow">
                    <a (click)="scrollTo(secondView)"><img src="./assets/images/arrow.svg" alt="Arrow"></a>
                </div>
            </div>
        </div>

        <div class="Intro-footer row">
            <img src="./assets/images/logo-broad-institute.svg" class="Intro-footerLogos" alt="Broad Institute Logo" />
            <img src="./assets/images/logo-dana-farber-cancer-institute.svg" class="Intro-footerLogos" alt="Dana Farber Logo">
        </div>
        
        <div class="Intro row">
            <section class="Message Message--intro col-lg-6 col-lg-offset-1 col-md-7 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-10 col-xs-offset-1">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.WelcomeTitle
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.WelcomeText
                </p>
            </section>
        </div>

        <div class="row">
            <a #secondView></a>
            <section class="Message Message--intro col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                <h1 class="Message-title Message-title--intro" translate>
                    Toolkit.Welcome.Intro
                </h1>
                <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                    Toolkit.Common.CountMeInButton
                </a>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.Participate
                </h1>
            </section>
        </div>

        <div class="row">
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-img src="./assets/images/step-1.svg" class="Message-stepImage" alt="Step 1">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.Steps.FirstStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.Steps.FirstStep.Subtitle
                </h2>
                <p class="Message-stepText">
                    <span translate>Toolkit.Welcome.Steps.FirstStep.TextPt1</span>
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Color--orange" translate> Toolkit.Welcome.Steps.FirstStep.Link </a>
                    <span translate>Toolkit.Welcome.Steps.FirstStep.TextPt2</span>
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-img src="./assets/images/step-2.svg" class="Message-stepImage" alt="Step 2">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.Steps.SecondStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.Steps.SecondStep.Subtitle
                </h2>
                <p class="Message-stepText" [innerHTML]="'Toolkit.Welcome.Steps.SecondStep.Text' | translate">
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-img src="./assets/images/step-3.svg" class="Message-stepImage" alt="Step 3">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.Steps.ThirdStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.Steps.ThirdStep.Subtitle
                </h2>
                <p class="Message-stepText" translate>
                    Toolkit.Welcome.Steps.ThirdStep.Text
                </p>
            </div>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row row--moreBottomMargin">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                <h1 class="Message-title Message-title--intro" translate>
                    Toolkit.Welcome.Closing
                </h1>
                <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                    Toolkit.Common.CountMeInButton
                </a>
            </section>
        </div>

    </div> 
    `
})
export class WelcomeComponent implements OnInit {
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;

    constructor(
        private windowRef: WindowRef,
        private analytics: GoogleAnalyticsEventsService,
        private browserContent: BrowserContentService) { }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    public clickCountMeIn(): void {
        this.doAnalytics();
        if (this.unsupportedBrowser) {
            this.browserContent.emitWarningEvent();
        }
    }

    public get showArrow(): boolean {
        return this.windowRef.nativeWindow.pageYOffset <= this.HEADER_HEIGHT;
    }

    public scrollTo(target: any): void {
        this.isIE ? this.simpleScrolling(target) : this.smoothScrolling(target);
    }

    private simpleScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: any): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }

    private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }

    private doAnalytics(): void {
        this.analytics.emitCustomEvent('clickedCountMeIn', 'fromMainPage');
    }
}
