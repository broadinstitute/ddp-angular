import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService, BrowserContentService, WindowRef, GoogleAnalytics } from 'ddp-sdk';

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
            <img src="./assets/images/logo-broad-institute.png" class="Intro-footerLogos" alt="Broad Institute Logo" />
            <img src="./assets/images/logo-dana-farber-cancer-institute.png" class="Intro-footerLogos" alt="Dana Farber Logo">
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
        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">
                <img lazy-resource src="./assets/images/mascot.svg" class="Message-mascot" alt="Prostate Cancer mascot">
                <p class="Message-text" translate>
                    Welcome.FirstBlock.Text
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
                    Welcome.SecondBlock.Title
                </h1>
            </section>
        </div>
        <div class="row">
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-1.svg" class="Message-stepImage" alt="Step 1">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.SecondBlock.FirstStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.SecondBlock.FirstStep.Subtitle
                </h2>
                <p class="Message-stepText">
                    <span translate>Welcome.SecondBlock.FirstStep.TextPt1</span>
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Link" translate>Welcome.SecondBlock.FirstStep.Link </a>
                    <span translate>Welcome.SecondBlock.FirstStep.TextPt2</span>
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-2.svg" class="Message-stepImage" alt="Step 2">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.SecondBlock.SecondStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.SecondBlock.SecondStep.Subtitle
                </h2>
                <p class="Message-stepText" [innerHTML]="'Welcome.SecondBlock.SecondStep.Text' | translate"></p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <img lazy-resource src="./assets/images/step-3.svg" class="Message-stepImage" alt="Step 3">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Welcome.SecondBlock.ThirdStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Welcome.SecondBlock.ThirdStep.Subtitle
                </h2>
                <p class="Message-stepText" translate>
                    Welcome.SecondBlock.ThirdStep.Text
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
                    <span translate>Welcome.ThirdBlock.TitlePt1</span>
                    <span class="Color--study Semibold" translate>Welcome.ThirdBlock.TitlePt2</span>
                    <span translate>Welcome.ThirdBlock.TitlePt3</span>
                </h1>
                <p class="Message-text" translate>
                    Welcome.ThirdBlock.Text
                </p>
            </section>
        </div>
        <div class="row">
            <div class="Separator"></div>
        </div>
        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Welcome.FourthBlock.Title
                </h1>
            </section>
            <section class="Message col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://www.pcf.org"  target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-prostate-cancer-foundation.png" alt="Prostate Cancer Foundation logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://pcainternational.org" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-prostate-cancer-international.png" alt="Prostate Cancer International logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://adkhikeforhope.org" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/logo-adirondack.png" alt="Adirondack logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://cancerabcs.org" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-cancer-abc.png" alt="Cancer ABC logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="http://ustoo.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-us-too.png" alt="Us Too logo logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://ancan.org/" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/logo-answer-cancer-foundation.jpg" alt="Answer Cancer Foundation logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://malecare.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-malecare.png" alt="Malecare logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://prostatenetwork.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-prostate-network.svg" alt="Prostate Network logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://patientpower.info/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-patient-power.png" alt="Patient Power logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="http://bluecure.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-blue-cure.jpg" alt="Blue Cure logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://themenscancernetwork.com/" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/logo-men-cancer-network.jpg" alt="The Men's Cancer Network logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://vetsprostate.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-veterans-prostate-cancer-awareness.png" alt="Veterans Prostate Cancer Awareness logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 PartnerLogo Message-partners">
                        <a href="https://fans4thecure.org/" target="_blank"><img class="partner-logo" lazy-resource src="/assets/images/logo-fans-4-the-cure.png" alt="Fans for the Cure logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://facingourrisk.org/" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/logo-force.png" alt="Facing Our Risk of Cancer Empowered logo"></a>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://hrprostatehealth.com/" target="_blank"><img class="partner-logo" lazy-resource src="./assets/images/logo-prostate-health-forum.png" alt="Hampton Roads Prostate Health Forum logo"></a>
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
                        Welcome.FifthBlock.TitlePt1
                    </span>
                    <br>
                    <span class="Color--study Semibold" translate>
                        Welcome.FifthBlock.TitlePt2
                    </span>
                </h1>
                <p class="Message-text" translate>
                    Welcome.FifthBlock.Text
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
        this.analytics.emitCustomEvent(GoogleAnalytics.ClickedCountMeIn, GoogleAnalytics.FromMainPage);
    }
}
