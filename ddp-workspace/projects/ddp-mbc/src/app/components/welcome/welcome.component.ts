import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService, BrowserContentService, GoogleAnalytics } from 'ddp-sdk';

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
            <img lazy-resource src="./assets/images/logo-broad-institute.svg" class="Intro-footerLogos" alt="Broad Institute Logo" />
            <img lazy-resource src="./assets/images/logo-dana-farber-cancer-institute.svg" class="Intro-footerLogos" alt="Dana Farber Logo">
        </div>

        <div class="Intro row">
            <section class="Message Message--intro col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12">
                <h1 class="Message-title Message-title--small" translate>
                    Toolkit.Welcome.WelcomeTitle
                </h1>
                <p class="Message-text Message-text--small" translate>
                    Toolkit.Welcome.WelcomeText
                </p>
            </section>
        </div>

        <div class="row">
            <a #secondView></a>
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                <img lazy-resource src="./assets/images/patient.png" class="Message-turtle" alt="Angiosarcoma pet">
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
            <img lazy-resource src="./assets/images/dna-strand.png" class="DNAStrand" alt="DNA Strand" />
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
                    <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="Link" translate>Toolkit.Welcome.ThirdBlock.FirstStep.Link</a>
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
            <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                Toolkit.Welcome.CountMeInButton
            </a>
        </div>

        <div class="row">
            <div class="Separator Separator--small"></div>
        </div>

        <div class="row">
            <section class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                <h1 class="Message-title">
                    <span translate>Toolkit.Welcome.FourthBlock.TitlePt1</span>
                    <span class="Color--blue Semibold" translate>Toolkit.Welcome.FourthBlock.TitlePt2</span>
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
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.mbcn.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbcn.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.avonfoundation.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-avon.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.mbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbca.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.lbbc.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-lbbc.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.ibcresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ibcrf.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.youngsurvival.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ysc.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.sharecancersupport.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-share.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://malebreastcancercoalition.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbcc.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.theresasresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-theresas.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://tnbcfoundation.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tnbc.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.theibcnetwork.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ibc.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://advocates4breastcancer.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-a4bc.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.metavivor.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-metavivor.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://metup.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-metup.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.tigerlilyfoundation.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tigerlily.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://ww5.komen.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-susangkomen.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.bcrf.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bcrf.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.drsusanloveresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-dslrf.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://bcsm.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bcsm.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://hopescarves.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-hopescarves.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.thecancercouch.com/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-cancer-couch-foundation.png" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://twistedpink.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-twistedpink.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.cierrasisters.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-cierra-sisters.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.breastcancertrials.org/BCTIncludes/index.html" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bc-trials.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://breastcanceralliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bca.jpg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://thetutuproject.com/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tutuproject.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.mpbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-MetaplasticBreastGlobalAlliance.svg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://lobularbreastcancer.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-lbca.png" alt="Sarcoma Alliance Logo"></a>
                    </div>

                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.facingourrisk.org/index.php" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-force.svg" alt="SARC Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://shaysharpespinkwishes.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-SSLogo-noBG.PNG" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.metastasis-research.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-MRS_LogoColor.jpg" alt="Sarcoma Alliance Logo"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://sistersrus.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-highresolutionpng.png" alt="Sarcoma Alliance Logo"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <img lazy-resource class="partner-logo" src="./assets/images/logo-hmn.png" alt="SARC Logo">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <img lazy-resource class="partner-logo" src="./assets/images/logo-min_coalition.png" alt="Sarcoma Alliance Logo">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <a href="https://mbccanada.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo_mbccanada.png" alt="Sarcoma Alliance Logo"></a>
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
                    <span class="Color--blue Semibold" translate>
                        Toolkit.Welcome.SixthBlock.TitlePt2
                    </span>
                </h1>
                <p class="Message-text" translate>
                    Toolkit.Welcome.SixthBlock.Text
                </p>
            </section>
        </div>

        <div class="row row--moreBottomMargin">
            <a [routerLink]="unsupportedBrowser ? null : '/count-me-in'" (click)="clickCountMeIn()" class="ButtonBordered ButtonBordered--orange Button--countMeIn" translate>
                Toolkit.Welcome.CountMeInButton
            </a>
        </div>
    </div>
    `
})
export class WelcomeComponent implements OnInit {
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;

    constructor(
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
        return window.pageYOffset <= this.HEADER_HEIGHT;
    }

    public scrollTo(target: any): void {
        this.isIE ? this.simpleScrolling(target) : this.smoothScrolling(target);
    }

    private simpleScrolling(target: any): void {
        window.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: any): void {
        window.scrollTo({
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
