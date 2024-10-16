import {Component, OnInit} from '@angular/core';
import {
    AnalyticsEventActions,
    AnalyticsEventCategories,
    AnalyticsEventsService,
    BrowserContentService,
    WindowRef
} from 'ddp-sdk';

@Component({
    selector: 'app-end-enroll',
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
                    <h1 class="Message-title margin-top-100">
                        <u><b>Enrollment is now CLOSED</b></u> for the Angiosarcoma Project (ASCproject).
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
                        Thank you to everyone who has taken part in the Angiosarcoma Project. We have now generated the largest cohort of patient data ever for this disease and will be generating impactful discoveries to help fuel future therapies for angiosarcoma patients.
                    </p>
                </section>
            </div>

            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text">
                        <a class="cmi-link" target="_blank" href="https://joincountmein.org"><u>Count Me In</u></a>
                         remains committed to elevating patient centered research, revolutionizing
                        the understanding of rare cancers and rare diseases, accelerate treatment discovery, and driving
                        medical progress.</p>
                </section>
            </div>

            <section
                class="main-timeline-title ">
                <div class="row">
                    <section
                        class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                        <h1 class="Message-title">
                            Angiosarcoma Project Updates
                        </h1>
                    </section>
                </div>

                <div class="container py-5">
                    <div class="main-timeline">
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2017</h1>
                                    <h4 class="mb-0">Angiosarcoma Project launches. Over 60 patients joined on the first
                                        day.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2018</h1>
                                    <h4 class="mb-0">First data generated through the project is shared in the public
                                        domain.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2019</h1>
                                    <h4 class="mb-0">Over 250 patients have consented. Additional data is shared in the
                                        public domain and used to design clinical trials for angiosarcoma patients.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>February</h4>
                                    <h1 class="margin-top-0">2020</h1>
                                    <h4>ASCproject is featured in Nature Medicine (<a class="mb-0" target="_blank" href="https://www.nature.com/articles/s41591-019-0749-z">The Angiosarcoma Project:
                                        enabling genomic and clinical discoveries in rare cancer through patient
                                        partnered research</a>)
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h4>November</h4>
                                    <h1 class="margin-top-0">2020</h1>
                                    <h4 class="mb-0">Phase II multicenter interventional trial starts.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2021</h1>
                                    <h4>Trial is complete & findings are published (<a class="mb-0" target="_blank" href="https://pubmed.ncbi.nlm.nih.gov/34380663/">Multicenter phase II trial (SWOG S1609, cohort 51) of ipilimumab and nivolumab in metastatic or unresectable angiosarcoma: a substudy of dual anti-CTLA-4 and anti-PD-1 blockade in rare tumors (DART)</a>)
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2024</h1>
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
                    class="Message col-lg-6 col-lg-offset-3  ">
                    <p class="Message-text margin-top-20">
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
