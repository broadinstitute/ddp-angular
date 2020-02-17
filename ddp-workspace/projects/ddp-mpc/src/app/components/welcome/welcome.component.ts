import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService, BrowserContentService, WindowRef } from 'ddp-sdk';

@Component({
    selector: 'welcome',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
    <div class="Wrapper">
        <a id="topView"></a>
        <div class="Intro-image">
            <div class="Intro-imageSpan" role="img" aria-label="Esophageal and Stomach Cancer Homepage Image">
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
            <section class="Message Message--intro col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                <h1 class="Message-title" translate>
                    Welcome.Intro.Title
                </h1>
                <p class="Message-text" translate>
                    Welcome.Intro.Text
                </p>
            </section>
        </div>
        <a #secondView></a>
        <div class="row intro-row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 NoPadding">
                <p class="Message-text" translate>
                    Welcome.FirstBlock.Text
                </p>
            </section>
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row NoPadding NoMargin">
            <section class="Message col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Welcome.SecondBlock.Title
                </h1>
                <p class="Message-text" translate>
                    Welcome.SecondBlock.Text
                </p>
            </section>
            <img lazy-resource src="./assets/images/dna-strand.svg" class="DNAStrand" alt="DNA Strand" />
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Welcome.ThirdBlock.Title
                </h1>
            </section>
        </div>
        <div class="row">
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-1.svg" class="Message-stepImage" alt="Step 1">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.ThirdBlock.FirstStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.ThirdBlock.FirstStep.Subtitle
                </h2>
                <p class="Message-stepText">
                    <span translate>Welcome.ThirdBlock.FirstStep.TextPt1</span>
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Link" translate>Welcome.ThirdBlock.FirstStep.Link </a>
                    <span translate>Welcome.ThirdBlock.FirstStep.TextPt2</span>
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-2.svg" class="Message-stepImage" alt="Step 2">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.ThirdBlock.SecondStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.ThirdBlock.SecondStep.Subtitle
                </h2>
                <p class="Message-stepText" [innerHTML]="'Welcome.ThirdBlock.SecondStep.Text1' | translate"></p>
                <p class="Message-stepText">
                    <span translate>Welcome.ThirdBlock.SecondStep.Text2.Part1</span>
                    <a routerLink="/more-details"  class="Link" translate>Welcome.ThirdBlock.SecondStep.Text2.Part2</a>.
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-3.svg" class="Message-stepImage" alt="Step 3">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.ThirdBlock.ThirdStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.ThirdBlock.ThirdStep.Subtitle
                </h2>
                <p class="Message-stepText" translate>
                    Welcome.ThirdBlock.ThirdStep.Text
                </p>
            </div>
        </div>
        <div class="row">
            <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered Button--countMeIn" translate>
                Common.CMIButton
            </a>
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>Welcome.FourthBlock.TitlePt1</span>
                    <span class="Color--study Semibold" translate>Welcome.FourthBlock.TitlePt2</span>
                    <span translate>Welcome.FourthBlock.TitlePt3</span>
                </h1>
                <p class="Message-text" translate>
                    Welcome.FourthBlock.Text
                </p>
            </section>
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Welcome.FifthBlock.LeadTitle
                </h1>
            </section>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 Message-partners">
                        <a href="http://www.targetcancerfoundation.org/" target="_blank"><img class="partner-logo--single" lazy-resource src="./assets/images/target-cancer-foundation-logo.svg" alt="Target Cancer Foundation logo"></a>
                    </div>
                </div>
            </section>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Welcome.FifthBlock.PartnersTitle
                </h1>
            </section>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://ecan.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/esophageal-cancer-action-network.png" alt="Esophageal Cancer Action Network logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.ecaware.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/esophageal-cancer-awareness-association.jpg" alt="Esophageal Cancer Awareness Association logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://www.degregorio.org/wp/" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/SarcomaFoundationOfAmerica-logo.svg" src="/assets/images/degregorio-family-foundation.jpg" alt="DeGregorio Family Foundation logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://debbiesdream.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/debbies-dream-foundation.svg" alt="Debbie's Dream Foundation logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.gicancersalliance.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/gi-cancers-alliance.png" alt="GI Cancers Alliance logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://gastriccancer.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/gastric-cancer-foundation.png" alt="Gastric Cancer Foundation logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.nostomachforcancer.org" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/no-stomach-for-cancer.png" alt="No Stomach for Cancer logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://stocan.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/hope-for-stomach-cancer.jpg" alt="Hope for Stomach Cancer"></a>
                    </div>
                </div>
            </section>
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>
                        Welcome.SixthBlock.TitlePt1
                    </span>
                    <br>
                    <span class="Color--study Semibold" translate>
                        Welcome.SixthBlock.TitlePt2
                    </span>
                </h1>
                <p class="Message-text" translate>
                    Welcome.SixthBlock.Text
                </p>
            </section>
        </div>
        <div class="row row--moreBottomMargin">
            <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered Button--countMeIn" translate>
                Common.CMIButton
            </a>
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
