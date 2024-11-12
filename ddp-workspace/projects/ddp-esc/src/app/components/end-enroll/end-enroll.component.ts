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
                <div class="Intro-imageSpan" role="img" aria-label="Esophageal & Stomach Homepage Image">
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
                    <h1 class="Message-title margin-top-50">
                        <u><b>Enrollment is now CLOSED</b></u> for the Esophageal and Stomach Cancer Project.
                    </h1>
                </section>
            </div>

            <div class="row">
                <a #secondView></a>
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text margin-top-120">
                        Thank you to everyone who has participated in the project. We continue to analyze and share the data generated through your partnership, which will help shape the future of research in esophageal and stomach cancers.
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
                            Esophageal and Stomach Cancer Project Timeline
                        </h1>
                    </section>
                </div>

                <div class="container py-5">
                    <div class="main-timeline">
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2018</h1>
                                    <h4 class="mb-0">Project launched as the “Gastroesophageal Project (GEC)”.
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2019</h1>
                                    <h4 class="mb-0">Name changed to “Esophageal and Stomach Cancer Project” based on community feedback</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2020</h1>
                                    <h4 class="mb-0">Over 230 patients consented to participate in the project</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2021</h1>
                                    <h4 class="mb-0">De-identified patient-reported data from 165 participants released via a secure patient data browser <a class="mb-0" target="_blank" href="https://escproject.org/">(ESCp Data)</a></h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1 class="margin-top-0">2024</h1>
                                    <h4>Over 287 esophageal and stomach cancer patients have fully enrolled. Data generated through this project will be deidentified and added to repositories for ongoing research.</h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1 class="margin-top-0">2024</h1>
                                    <h4 class="mb-0">Partnership with Mass General Brigham and Dana-Farber Cancer Institute established, funded by a Degregorio Foundation award, to study biomarker tumor response in patients with esophageal and stomach cancers, which may help identify better targets for future drug treatment</h4>
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
