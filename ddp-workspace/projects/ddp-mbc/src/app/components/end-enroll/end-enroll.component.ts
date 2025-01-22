import {Component, OnInit} from '@angular/core';
import {
    AnalyticsEventActions,
    AnalyticsEventCategories,
    AnalyticsEventsService,
    BrowserContentService,
    NGXTranslateService,
    WindowRef
} from 'ddp-sdk';
import {Observable} from 'rxjs';
// import {ToolkitConfigurationService} from "toolkit";

@Component({
    selector: 'app-end-enroll',
    template: `

        <toolkit-header [showButtons]="false" [showLanguageSelector]="true"></toolkit-header>

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
                    class="Message Message--intro">
                    <h1 class="Message-title text-underline-bold margin-enroll-end-text" style="font-weight: bold;" translate>
                        Toolkit.EndEnroll.TitlePart1
                    </h1>
                    <h1 class="Message-title margin-enroll-end-text" translate>
                        Toolkit.EndEnroll.TitlePart2
                    </h1>
                </section>
            </div>

            <div class="row">
                <a #secondView></a>
                <section
                    class="Message margin-top-20 col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <img lazy-resource src="./assets/images/patient.png" class="Message-patient">
                </section>
            </div>

            <div class="row">
                <section
                    class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                    <p class="Message-text margin-top-80" translate>
                        Toolkit.EndEnroll.Heading1
                    </p>
                </section>
            </div>

            <div class="row">
                <section>
                    <p class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                        <a [href]="countMeInUrl" class="cmi-link" target="_blank" translate>Count Me In (CMI)</a>
                        <span translate>Toolkit.EndEnroll.Heading2</span>
                    </p>
                </section>
            </div>

            <section
                class="main-timeline-title ">
                <div class="row">
                    <section
                        class="Message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1 NoPadding">
                        <h3 class="Message-title" translate>
                            Toolkit.EndEnroll.timeline.Heading
                        </h3>
                    </section>
                </div>

                <div class="container py-5">
                    <div class="main-timeline">
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h3 class="mb-0" translate>
                                        Toolkit.EndEnroll.timeline.2015.October
                                    </h3>
                                    <h1 class="mb-0" translate>
                                        2015
                                    </h1>
                                    <h4 class="mb-0" translate>
                                        Toolkit.EndEnroll.timeline.2015.Pt1
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <h1>2016</h1>
                                    <h4 class="mb-0" translate>
                                        Toolkit.EndEnroll.timeline.2016.heading1
                                    </h4>
                                    <h4 class="mb-0" translate>
                                        Toolkit.EndEnroll.timeline.2016.heading2
                                    </h4>
                                    <ul>
                                        <li><h4 class="mb-0">The Wall Street Journal (<a class="mb-0" target="_blank" href="http://www.wsj.com/articles/researchers-take-aim-at-metastatic-breast-cancer-1455592266" style="color:#2BB673;"><u>Researchers Take Aim at Metastatic Breast Cancer</u></a>
                                            and <a class="mb-0" target="_blank" href="http://www.wsj.com/articles/new-studies-rely-on-the-internet-for-help-treating-cancer-patients-1465238017" style="color:#2BB673;"><u>New Studies Rely on the Internet for Help Treating Cancer Patients</u></a>)</h4></li>
                                        <li><h4 class="mb-0">The New York Times Magazine<a class="mb-0" target="_blank" href="http://www.nytimes.com/2016/05/15/magazine/exceptional-responders-cancer-the-lazarus-effect.html?_r=1" style="color:#2BB673;"><u>(Learning from the Lazarus Effect)</u></a></h4></li>
                                        <li><h4 class="mb-0">Associated Press (<a class="mb-0" target="_blank" href="https://apnews.com/general-news-56825b4874e346df8015b1e42138de4b" style="color:#2BB673;"><u>Crowdsourcing effort takes aim at deadliest breast cancers article</u></a>
                                            and <a class="mb-0" target="_blank" href="https://www.youtube.com/watch?v=WOM1o6GlTro" style="color:#2BB673;"><u>video</u></a>)</h4></li>
                                        <li><h4 class="mb-0">Fast Company <a class="mb-0" target="_blank" href="http://www.fastcompany.com/3058311/cancer-researchers-are-conducting-huge-studies-using-twitter-facebook" style="color:#2BB673;"><u>(#Cancer: Researchers are conducting huge studies using Twitter, Facebook)</u></a></h4></li>
                                        <li><h4 class="mb-0"><a class="mb-0" target="_blank" href="https://atlantablackstar.com/2016/10/20/new-project-aims-to-better-understand-metastatic-breast-cancer-in-black-patients-by-sampling-dna-tumor-tissues/" style="color:#2BB673;"><u>Atlanta Black Star</u></a></h4></li>
                                        <li><h4 class="mb-0">Broad Institute blog (<a class="mb-0" target="_blank" href="https://giving.broadinstitute.org/power-patients" style="color:#2BB673;"><u>Power to the Patients</u></a>
                                            and Youtube channel <a class="mb-0" target="_blank" href="https://www.youtube.com/watch?v=57PNC5JJu2I" style="color:#2BB673;"><u>Metastatic Breast Cancer Project: Patient-Driven Research</u></a>)</h4></li>
                                        <li><h4 class="mb-0">Project patient visit to discuss the project and why it’s so important to patients and researchers alike (<a class="mb-0" target="_blank" href="https://www.youtube.com/watch?v=BWyzY9eggI8" style="color:#2BB673;"><u>The Metastatic Breast Cancer Project</u></a>).</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2017</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2017.Pt1</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2017.Pt2</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2017.Pt3-1<a class="mb-0" target="_blank" href="https://www.youtube.com/watch?v=-L4BnpEJd30" style="color:#2BB673;"><u> video </u></a>
                                            Toolkit.EndEnroll.timeline.2017.Pt3-2<a class="mb-0" target="_blank" href="https://www.broadinstitute.org/news/learning-lessons-past-mbc-project-engages-patients-diversify-medical-research" style="color:#2BB673;"><u>article</u></a>Toolkit.EndEnroll.timeline.2017.Pt3-3</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2017.Pt4<a class="mb-0" target="_blank" href="https://cbioportal.org/" style="color:#2BB673;"><u> cBioPortal</u></a></h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2017.Pt5</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2018</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt1</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt2</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt3</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt4</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt5</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2018.Pt6</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                    <h1>2019</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2019.Pt1-1<a class="mb-0 text-underline"  translate target="_blank" href="https://www.ncbi.nlm.nih.gov/gap/" style="text-decoration: underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2019.Pt1-2</a>
                                            Toolkit.EndEnroll.timeline.2019.Pt1-3<a class="mb-0 text-underline" translate target="_blank" href="https://portal.gdc.cancer.gov/" style="color:#2BB673;text-decoration: underline;">Toolkit.EndEnroll.timeline.2019.Pt1-4</a>Toolkit.EndEnroll.timeline.2019.Pt1-5</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2019.Pt2</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2019.Pt3</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2019.Pt4-0<a class="mb-0 text-underline"  translate target="_blank" href="https://mbcproject.org/data-release" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2019.Pt4-1</a>
                                            Toolkit.EndEnroll.timeline.2019.Pt4-2</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2020</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2020.Pt1</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2020.Pt2-1<a class="mb-0 text-underline"  translate target="_blank" href="https://cbioportal.org/" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2020.cBioPortal</a>
                                            Toolkit.EndEnroll.timeline.2020.and<a class="mb-0 text-underline" translate target="_blank" href="https://www.ncbi.nlm.nih.gov/gap/" style="color:#2BB673;text-decoration: underline;">Toolkit.EndEnroll.timeline.2020.dbGap</a>Toolkit.EndEnroll.timeline.2020.Pt2-2</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2021</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt1</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt2</h4></li>
                                        <ul>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt2-1</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt2-2</h4></li>
                                        </ul>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt3</h4></li>

                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2021.Pt4-1<a class="mb-0 text-underline"  translate target="_blank" href="https://cbioportal.org/" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2020.cBioPortal</a>Toolkit.EndEnroll.timeline.2021.Pt4-2</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline right">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2023</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2023.Pt1-0<a class="mb-0 text-underline"  translate target="_blank" href="https://www.medrxiv.org/content/10.1101/2023.06.07.23291117v1" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2023.Pt1-1</a>
                                            Toolkit.EndEnroll.timeline.2023.Pt1-2</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2023.Pt2-1<a class="mb-0 text-underline"  translate target="_blank" href="https://tigerlilyfoundation.org/" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2023.Pt2-2</a>Toolkit.EndEnroll.timeline.2023.Pt2-3</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2023.Pt3</h4></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="timeline left">
                            <div class="card WrapperTL">
                                <div class="card-body p-4 WrapperTL">
                                    <ul>
                                        <h1>2025</h1>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt1-1<a class="mb-0 text-underline"  translate target="_blank" href="https://cbioportal.org/" style="text-decoration:underline; color:#2BB673;">Toolkit.EndEnroll.timeline.2020.cBioPortal</a>
                                            Toolkit.EndEnroll.timeline.2020.and<a class="mb-0 text-underline" translate target="_blank" href="https://portal.gdc.cancer.gov/" style="color:#2BB673;text-decoration: underline;">Toolkit.EndEnroll.timeline.2025.gdc</a>Toolkit.EndEnroll.timeline.2025.Pt1-2</h4></li>
                                            <ul><li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt1-3</h4></li></ul>

                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt2</h4></li>
                                        <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3</h4></li>
                                        <ul>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-1</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-2</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-3</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-4</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-5</h4></li>
                                            <li><h4 class="mb-0" translate>Toolkit.EndEnroll.timeline.2025.Pt3-6</h4></li>
                                        </ul>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div class="row">
                <p class="Message-2" translate>Toolkit.EndEnroll.contact
                    <a class='Link' href='mailto:info@joincountmein.org'>info@joincountmein.org</a>.
                </p>
            </div>

        </div>
    `
})
export class EndEnrollComponent implements OnInit {
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;
    public facebookUrl$: Observable<string>;
    public twitterUrl: string;
    public instagramUrl: string;
    public countMeInUrl: string;

    constructor(
        private windowRef: WindowRef,
        private analytics: AnalyticsEventsService,
        // private toolkitConfiguration: ToolkitConfigurationService,
        private browserContent: BrowserContentService,
        private ngxTranslate: NGXTranslateService) {
    }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
        this.facebookUrl$ = this.ngxTranslate.getTranslation('Toolkit.Footer.FacebookLink');
        this.countMeInUrl = 'https://joincountmein.org';
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
