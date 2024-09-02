import {Component, OnInit} from '@angular/core';
import {
    AnalyticsEventActions,
    AnalyticsEventCategories,
    AnalyticsEventsService,
    BrowserContentService,
    WindowRef
} from 'ddp-sdk';

@Component({
    selector: 'end-enroll',
    template: `

        <toolkit-header [showButtons]="false"></toolkit-header>

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
                <img src="./assets/images/logo-broad-institute.png" class="Intro-footerLogos"
                     alt="Broad Institute Logo"/>
                <img src="./assets/images/logo-new-DFCI.jpg" class="Intro-footerLogos" alt="Dana Farber Logo">
            </div>

            <div class="Intro row">
                <section
                    class="Message Message--intro col-lg-6 col-lg-offset-1 col-md-7 col-md-offset-1 col-sm-7 col-sm-offset-1 col-xs-10 col-xs-offset-1">
                    <h1 class="Message-title">
                        To everyone who has taken part in the Angiosarcoma Project, thank you for your invaluable partnership that continues to be instrumental in shaping the future of angiosarcoma.
                    </h1>
                </section>
            </div>


            <div class="row">
                <a #secondView></a>
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <img lazy-resource src="./assets/images/turtle.svg" class="Message-turtle" alt="Angiosarcoma pet">
                </section>
            </div>
            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text">
                        We are now prioritizing the ongoing analysis of data derived from everyone who enrolled. As
                        such, <strong>we are no longer enrolling new participants in the Angiosarcoma Project
                        (ASCproject).</strong>
                    </p>
                </section>
            </div>

            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text">
                        <u>Count Me In</u> remains committed to elevating patient centered research, to revolutionize
                        the understanding of rare cancers and rare diseases, accelerate treatment discovery, and drive
                        medical </p>
                </section>
            </div>

            <section style="background-color: #F5F5F0FF;">
                <div class="row WrapperTL">
                    <section
                        class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                        <h1 class="Message-title WrapperTL">
                            Angiosarcoma Project Updates
                        </h1>
                    </section>
                </div>

                <div class="container py-5">
                    <div class="main-timeline">
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>2017</h4>
                                    <h4 class="mb-0">Angiosarcoma Project launches. Over 60 patients joined on the first
                                        day.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>2018</h4>
                                    <h4 class="mb-0">First data generated through the project is shared in the public
                                        domain.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>2019</h4>
                                    <h4 class="mb-0">Over 250 patients have consented. Additional data is shared in the
                                        public domain and used to design clinical trials for angiosarcoma patients.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>Februrary 2020</h4>
                                    <h4 class="mb-0">ASCproject is featured in Nature Medicine (The Angiosarcoma Project:
                                        enabling genomic and clinical discoveries in rare cancer through patient
                                        partnered research).</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>November 2021</h4>
                                    <h4 class="mb-0">Phase II multicenter interventional trial starts.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>2021</h4>
                                    <h4 class="mb-0">Trial is complete & findings are published (Multicenter phase II
                                        trial (SWOG S1609, cohort 51) of ipilimumab and nivolumab in metastatic or
                                        unresectable angiosarcoma: a substudy of dual anti-CTLA-4 and anti-PD-1 blockade
                                        in rare tumors (DART))</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>2024</h4>
                                    <h4 class="mb-0">Over 470 angiosarcoma patients have fully enrolled. Data generated
                                        by the project will serve as a catalyst for ongoing research for years to
                                        come.</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text">
                        Questions? Please reach out to us at any time at <a class='Link' href='https://info@joincountmein.org.'>info@joincountmein.org</a>.
                    </p>
                </section>
            </div>

        </div>
    `
})
export class EndEnrollComponent implements OnInit {
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;

    constructor(
        private windowRef: WindowRef,
        private analytics: AnalyticsEventsService,
        private browserContent: BrowserContentService) {
    }

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

    public scrollTo(target: HTMLElement): void {
        if (this.isIE) {
            this.simpleScrolling(target);
        } else {
            this.smoothScrolling(target);
        }
    }

    private simpleScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }

    private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }

    private doAnalytics(): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromMainPage);
    }
}
