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
                <div class="Intro-imageSpan" role="img" aria-label="Metastatic Prostate Homepage Image">
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
                    class="Message Message--intro ">
                    <h1 class="Message-title margin-enroll-end-text">
                        <u><b>Enrollment is now CLOSED</b></u> for the Metastatic Prostate Cancer Project (MPCproject).
                    </h1>
                </section>
            </div>

            <div class="row">
                <a #secondView></a>
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text margin-top-120">
                        Thank you to everyone who has participated. The data generated through the project will continue to impact discoveries, ultimately leading to a better understanding and faster advances in the treatment of prostate cancer.
                    </p>
                </section>
            </div>

            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text">
                        <a class="cmi-link" target="_blank" href="https://joincountmein.org"><u>Count Me In</u></a>
                         remains committed to elevating patient centered research, revolutionizing
                        the understanding of rare cancers and rare diseases, accelerating treatment discovery, and driving
                        medical progress.</p>
                </section>
            </div>

            <section
                class="main-timeline-title ">
                <div class="row">
                    <section
                        class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                        <h1 class="Message-title">
                            Metastatic Prostate Cancer Project Timeline
                        </h1>

                    </section>
                </div>

                <div class="container py-5">
                    <div class="main-timeline">
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2018</h1>
                                        <li><h4 class="mb-0">MPCproject launched through collaboration with patients and advocates</h4></li>
                                        <li><h4 class="mb-0">Poster presentation at GU ASCO: <a class="mb-0" target="_blank" href="https://ascopubs.org/doi/10.1200/JCO.2018.36.6_suppl.279" style="color:#1862AB;"> <u>The Metastatic Prostate Cancer (MPCproject): transational genomics through direct patient engagement</u></a></h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2019</h1>
                                        <li><h4 class="mb-0">First data release from 19 patients shared on  <a class="mb-0" target="_blank" href="https://cbioportal.org/" style="color:#1862AB;"><u>cBioPortal</u></a></h4></li>
                                        <li><h4 class="mb-0">GU Onc Uro Today podcast with Dr. Chuck Ryan featured Dr. Eli Van Allen discussing the project: <a class="mb-0" target="_blank" href="https://www.urotoday.com/video-lectures/clinical-trials-for-my-patients-prostate-cancer/video/1484-count-me-in-the-metastatic-prostate-cancer-project-eliezer-van-allen.html" style="color:#1862AB;"><u>Count Me In! The Metastatic Prostate Cancer Project - Eliezer Van Allen</u></a></h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2020</h1>
                                        <li><h4 class="mb-0">Data shared with researchers through additional repositories: the National Institute of Health’s (NIH) <a class="mb-0" target="_blank" href="https://www.ncbi.nlm.nih.gov/gap/" style="color:#1862AB;"><u>database of Genotypes and Phenotypes (dbGaP)</u></a> and the National Cancer Institute’s (NCI) <a class="mb-0" target="_blank" href="https://portal.gdc.cancer.gov/" style="color:#1862AB;"><u>Genomic Data Commons (GDC)</u></a></h4></li>
                                        <li><h4 class="mb-0">First request for serial blood samples from existing participants</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2021</h1>
                                        <li><h4 class="mb-0">Over 750 individuals with advanced or metastatic prostate cancer have fully enrolled in the project</h4></li>
                                        <li><h4 class="mb-0">Preprint of publication shared on bioRx <a class="mb-0" target="_blank" href="https://www.biorxiv.org/content/10.1101/2021.07.09.451849v2" style="color:#1862AB;"><u>A patient driven clinicogenomic partnership through the Metastatic Prostate Cancer Project | bioRxiv </u></a></h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                    <h1>2022</h1>
                                    <li><h4>Publication printed in Cell Genomics: <a class="mb-0" target="_blank" href="https://pubmed.ncbi.nlm.nih.gov/36177448/" style="color:#1862AB;"><u>A patient-driven clinicogenomic partnership for metastatic prostate cancer</u></a></h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2025</h1>
                                        <li><h4 class="mb-0">Over 900 metastatic prostate cancer patients have fully enrolled, including nearly 100 serial blood sample participants. Data generated by the project will serve as a catalyst for ongoing research for years to come</h4></li>
                                        <li><h4 class="mb-0">Analysis and publication of final data set to come, including patient reported data, abstracted medical record data, and sequenced genomic data from ~370 patients</h4></li>
                                        <li><h4 class="mb-0">Final data set also includes data on >175 serial blood samples from >75 participants</h4></li>
                                    </ul>
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
