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
            <section class="Message Message--intro col-lg-6 col-lg-offset-1 col-md-7 col-md-offset-1 col-sm-7 col-sm-offset-1 col-xs-10 col-xs-offset-1">
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
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                <img lazy-resource src="./assets/images/turtle.svg" class="Message-turtle" alt="Angiosarcoma pet">
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
                <h1 class="Message-title">
                    <span translate>
                        Toolkit.Welcome.SecondBlock.TitlePt1
                    </span>
                    <br>
                    <span translate>
                        Toolkit.Welcome.SecondBlock.TitlePt2
                    </span>
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.SecondBlock.Text
                </p>
            </section>
        </div>

        <div class="row">
            <div class="Separator Separator--large"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title" translate>
                    Toolkit.Welcome.ThirdBlock.Title
                </h1>
            </section>
        </div>

        <div class="row">
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-1.svg" class="Message-stepImage" alt="Step 1">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.FirstStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.FirstStep.Subtitle
                </h2>
                <p class="Message-stepText">
                    <span translate>Toolkit.Welcome.ThirdBlock.FirstStep.TextPt1</span>
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Color--orange" translate> Toolkit.Welcome.ThirdBlock.FirstStep.Link </a>
                    <span translate>Toolkit.Welcome.ThirdBlock.FirstStep.TextPt2</span>
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-2.svg" class="Message-stepImage" alt="Step 2">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.SecondStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.SecondStep.Subtitle
                </h2>
                <p class="Message-stepText" [innerHTML]="'Toolkit.Welcome.ThirdBlock.SecondStep.Text' | translate">
                </p>
            </div>
            <div class="Message-step col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img lazy-resource src="./assets/images/step-3.svg" class="Message-stepImage" alt="Step 3">
                <h1 class="Message-stepTitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.ThirdStep.Title
                </h1>
                <h2 class="Message-stepSubtitle NoMargin" translate>
                    Toolkit.Welcome.ThirdBlock.ThirdStep.Subtitle
                </h2>
                <p class="Message-stepText" translate>
                    Toolkit.Welcome.ThirdBlock.ThirdStep.Text
                </p>
            </div>
        </div>

        <div class="row">
            <a href [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                Toolkit.Welcome.ThirdBlock.CountMeInButton
            </a>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>Toolkit.Welcome.FourthBlock.TitlePt1</span>
                    <span class="Color--orange Semibold" translate> Toolkit.Welcome.FourthBlock.TitlePt2 </span>
                    <span translate>Toolkit.Welcome.FourthBlock.TitlePt3</span>
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.FourthBlock.Text
                </p>
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
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://www.sarctrials.org" target="_blank"><img lazy-resource src="./assets/images/SARC-logo.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://sarcomaalliance.org" target="_blank"><img lazy-resource src="./assets/images/SarcomaAlliance-logo.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://www.curesarcoma.org" target="_blank"><img lazy-resource src="./assets/images/SarcomaFoundationOfAmerica-logo.svg" alt="Sarcoma Foundation of America Logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://www.targetcancerfoundation.org" target="_blank"><img lazy-resource src="./assets/images/TargetCancerFoundation-logo.svg" alt="Target Cancer Foundation Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="https://www.paulatakacsfoundation.org" target="_blank"><img lazy-resource src="./assets/images/PaulaTakacs-logo.svg" alt="The Paula Takacs Foundation Logo"></a>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                        <a href="http://www.cureasc.org" target="_blank"><img lazy-resource src="./assets/images/AngiosarcomaAwareness-logo.svg" alt="Angiosarcoma Awareness Logo"></a>
                    </div>
                </div>
            </section>
        </div>

        <div class="row row--moreTopMargin">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <div class="Message-quote">
                    <blockquote translate>
                        Toolkit.Welcome.FifthBlock.Quote
                    </blockquote>
                </div>
                <br>
                <div class="Message-quote Message-quoteExtraMargin" [innerHTML]="'Toolkit.Welcome.FifthBlock.QuoteAuthor' | translate">
                </div>
                <div class="Message-quote Message-quoteExtraMargin">
                    <a href="http://www.cureasc.org" target="_blank" class="Link" translate>
                        Toolkit.Welcome.FifthBlock.Link
                    </a>
                </div>
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
        this.analytics.emitCustomEvent('clickedCountMeIn', 'fromMainPage');
    }
}
