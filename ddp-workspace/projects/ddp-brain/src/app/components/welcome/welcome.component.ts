import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService, BrowserContentService, WindowRef, GoogleAnalytics } from 'ddp-sdk';

@Component({
    selector: 'welcome',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
    <div class="Wrapper">
        <a id="topView"></a>
        <div class="Intro-image">
        <div class="Intro-imageSpan" role="img" aria-label="Brain Cancer Project Homepage Image">
        <span class="Intro-imageInner"></span>
                <div *ngIf="showArrow" class="Intro-arrow">
                    <a (click)="scrollTo(secondView)"><img src="./assets/images/arrow.svg" alt="Arrow"></a>
                </div>
            </div>
        </div>

        <div class="Intro-footer row">
            <img lazy-resource src="./assets/images/logo-broad-institute.png" class="Intro-footerLogos" alt="Broad Institute Logo" />
            <img lazy-resource src="./assets/images/logo-dana-farber-cancer-institute.png" class="Intro-footerLogos" alt="Dana Farber Logo">
            <img lazy-resource src="./assets/images/logo-minderoo.png" class="Intro-footerLogo-square" alt="Minderoo Foundation Logo">
        </div>

        <div class="Intro row">
            <section class="Message Message--intro col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12">
                <h1 class="Message-title" [innerHTML]="'Toolkit.Welcome.WelcomeTitle' | translate"></h1>
                <p class="Message-text" [innerHTML]="'Toolkit.Welcome.WelcomeText' | translate"></p>
            </section>
        </div>

        <div class="row" style="margin-top: 150px">
            <a #secondView></a>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                <p class="Message-text" translate>
                    Toolkit.Welcome.SmallTitle
                </p>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.FirstBlock.Title
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.FirstBlock.Text
                </p>
            </section>
        </div>

        <div class="row NoPadding NoMargin">
            <img lazy-resource src="./assets/images/dna-strand.svg" class="DNAStrand" alt="DNA Strand" />
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.SecondBlock.Title
                </h1>
            </section>
        </div>

        <div class="row">
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-1.svg" class="Message-stepImage" alt="Step 1">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.FirstStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.FirstStep.Subtitle
                </h2>
                <p class="Message-stepText">
                    <span translate>Toolkit.Welcome.SecondBlock.FirstStep.TextPt1</span>
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Color--orange" translate>Toolkit.Welcome.SecondBlock.FirstStep.Link</a>
                    <span translate>Toolkit.Welcome.SecondBlock.FirstStep.TextPt2</span>
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-2.svg" class="Message-stepImage" alt="Step 2">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.SecondStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.SecondStep.Subtitle
                </h2>
                <p class="Message-stepText" [innerHTML]="'Toolkit.Welcome.SecondBlock.SecondStep.Text1' | translate"></p>
                <p class="Message-stepText">
                    <span translate>Toolkit.Welcome.SecondBlock.SecondStep.Text2.Text</span>
                    <a routerLink="/more-details" class="Color--orange" translate>Toolkit.Welcome.SecondBlock.SecondStep.Text2.Link</a>.
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-3.svg" class="Message-stepImage" alt="Step 3">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.ThirdStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.SecondBlock.ThirdStep.Subtitle
                </h2>
                <p class="Message-stepText" translate>
                    Toolkit.Welcome.SecondBlock.ThirdStep.Text
                </p>
            </div>
        </div>

        <div class="row">
            <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                Toolkit.Welcome.SecondBlock.CountMeInButton
            </a>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>Toolkit.Welcome.ThirdBlock.TitlePt1</span>
                    <span class="Color--orange Semibold" translate>Toolkit.Welcome.ThirdBlock.TitlePt2</span>
                    <span translate>Toolkit.Welcome.ThirdBlock.TitlePt3</span>
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.ThirdBlock.Text
                </p>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.FourthBlock.Title.Engagement
                </h1>
            </section>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 Message-partners">
                        <a href="http://www.targetcancerfoundation.org/" target="_blank"><img lazy-resource class="partner-logo--single" src="./assets/images/TCF-Logo.png" alt="Target Cancer Foundation"></a>
                    </div>
                </div>
            </section>

            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.FourthBlock.Title.Advocacy
                </h1>
            </section>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.abta.org/" target="_blank">
                            <img lazy-resource class="partner-logo" src="./assets/images/ABTA-logo.jpg" alt="American Brain Tumor Association logo">
                        </a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://braintumor.org/" target="_blank">
                            <img lazy-resource class="partner-logo" src="./assets/images/NBTS-logo.png" alt="National Brain Tumor Society logo">
                        </a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.oligonation.org/" target="_blank">
                            <img lazy-resource class="partner-logo" src="./assets/images/OligoNation_Logo.jpg" alt="Oligo Nation logo">
                        </a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.dragonmaster.org/" target="_blank">
                            <img lazy-resource class="partner-logo" src="./assets/images/DMF-logo.jpg" alt="Dragon Master Foundation logo">
                        </a>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 Message-partners">
                        <a href="https://ourbrainbank.org/" target="_blank">
                            <img lazy-resource class="partner-logo" src="./assets/images/OurBrainBank-logo.png" alt="OurBrainBank logo">
                        </a>
                    </div>
                </div>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.FifthBlock.Title
                </h1>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>
                        Toolkit.Welcome.SixthBlock.TitlePt1
                    </span>
                    <br>
                    <span class="Color--orange Semibold" translate>
                        Toolkit.Welcome.SixthBlock.TitlePt2
                    </span>
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.SixthBlock.Text
                </p>
            </section>
        </div>

        <div class="row row--moreBottomMargin">
            <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                Toolkit.Welcome.SixthBlock.CountMeInButton
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
