import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DisclaimerComponent, ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'data-release',
    template: `
    <toolkit-header [showButtons]="false"></toolkit-header>
    <div class="Wrapper">
        <div class="PageHeader">
            <div class="PageHeader-background">
                <div class="PageLayout">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h1 class="PageHeader-title" translate>
                            Toolkit.DataRelease.Title
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <article class="PageContent">
            <div class="PageLayout">
                <div class="row NoMargin">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section class="PageContent-section">
                            <div class="row topMarginMedium">
                                <p class="PageContent-text" translate>Toolkit.DataRelease.Intro.Paragraph1</p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.Intro.Paragraph2</p>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Intro.Paragraph3</span>
                                    <a [href]="dataEmailHref" class="Link">{{dataEmail}}</a>.
                                </p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.Intro.Paragraph4</p>
                                <div class="row Left margin-top-bottom">
                                    <a href="http://em.rdcu.be/ls/click?upn=1VX9wGiUV7k-2FG8imEHteF25Ol5yBjR8SA-2FhQtoXbTgU-3DgnoE_eYO6zdaQoUubxrJz-2BH2Zv38FHa3PI5OJUb9BGSLB-2BF6glT83ifBpYralVEDHtm8fUe-2Fn2THVk97Rxygjq3vwNUApHjpwIHPbAn8NGj-2B4k4IRyGmAQwVgdtIxzIPwH4I5t0r5oau6ZlrcVrlqp9-2FKg4-2FwNLNPuZX3HycTX0v1XpUk2lh15XEgnM6M0A5rOIG1YGhUUshXmSFLbpMQGgGKsQb6ejoYL1PsmMQEhEJu94850We9c0axfNJM1lsMxWGnC83WszbjBFZwZBjJ5KrqH09R57ssi7kp2rpSMCUNxrEZfn-2BdVj0614MEOChUvTOT"
                                       target="_blank">
                                        <button mat-button color="primary"
                                                class="ButtonFilled Button--rect"
                                                [innerHTML]="'Toolkit.DataRelease.ViewPaperButton' | translate">
                                        </button>  
                                    </a>
                                </div>
                                <p class="PageContent-text PageContent-text__important" translate>Toolkit.DataRelease.Intro.Paragraph5</p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.Intro.Paragraph6</p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.Intro.Paragraph7</p>
                                
                                <h2 class="PageContent-title" translate>Toolkit.DataRelease.cBioPortal.Title</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.cBioPortal.Paragraph1</p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.cBioPortal.Paragraph2</p>
                                <div class="row Left margin-top-bottom">
                                    <button mat-button color="primary"
                                            class="ButtonFilled Button--rect"
                                            (click)="openDisclaimerDialog()"
                                            [innerHTML]="'Toolkit.DataRelease.ViewDataButton' | translate">
                                    </button>
                                </div>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.cBioPortal.Paragraph3.Part1</span>
                                    <a class="Link" href="https://www.cbioportal.org/study/summary?id=angs_project_painter_2018" target="_blank" translate>
                                        Toolkit.DataRelease.cBioPortal.Paragraph3.Link</a>.
                                    <span translate>Toolkit.DataRelease.cBioPortal.Paragraph3.Part2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.cBioPortal.Paragraph4</h2>
                                <ul class="PageContent-ul">
                                    <ng-container *ngFor="let item of 'Toolkit.DataRelease.cBioPortal.List' | translate">
                                        <li class="PageContent-text PageContent-text-list">{{item}}</li>        
                                    </ng-container>
                                </ul>

                                <h2 class="PageContent-title" translate>Toolkit.DataRelease.GDC.Title</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.GDC.Paragraph1</p>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.GDC.Paragraph2.Part1</span>
                                    <a class="Link" href="https://gdc.cancer.gov/about-gdc/contributed-genomic-data-cancer-research/count-me-cmi" target="_blank" translate>
                                        Toolkit.DataRelease.GDC.Paragraph2.Link</a>
                                    <span translate>Toolkit.DataRelease.GDC.Paragraph2.Part2</span>
                                </p>
                                <div class="row Left margin-top">
                                    <a href="https://portal.gdc.cancer.gov/projects/CMI-ASC"
                                    target="_blank">
                                        <button mat-button color="primary"
                                                class="ButtonFilled Button--rect"
                                                [innerHTML]="'Toolkit.DataRelease.ViewDataInGDC' | translate">
                                        </button>
                                    </a>
                                </div>
                                <ng-container *ngFor="let item of 'Toolkit.DataRelease.GDC.Questions' | translate">
                                    <h2 class="PageContent-subtitle">{{item.Question}}</h2>
                                    <p class="PageContent-text">{{item.Answer}}</p> 
                                </ng-container>

                                <h2 class="PageContent-title" translate>Toolkit.DataRelease.FAQ.Title</h2>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Dataset.Question</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.Dataset.Answer</p>
                                <ul class="PageContent-ul">
                                    <ng-container *ngFor="let item of 'Toolkit.DataRelease.FAQ.Dataset.List' | translate">
                                        <li class="PageContent-text PageContent-text-list">{{item.Text}}</li>
                                        <ul *ngIf="item.SubList.length">
                                            <ng-container *ngFor="let subItem of item.SubList">
                                                <li class="PageContent-text Sub-item">{{subItem}}</li>
                                            </ng-container>
                                        </ul>
                                    </ng-container>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.ClinicalCare.Question</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.ClinicalCare.Answer</p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Samples.Question</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.Samples.Answer</p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Methods.Question</h2>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.FAQ.Methods.Answer.Part1</span>
                                    <a [href]="dataEmailHref" class="Link">{{dataEmail}}</a>
                                    <span translate>Toolkit.DataRelease.FAQ.Methods.Answer.Part2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Cited.Question</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.Cited.Answer1</p>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.FAQ.Cited.Answer2.Part1</span>
                                    <a href="https://www.cbioportal.org/study/summary?id=angs_project_painter_2018" class="Link" translate>
                                        Toolkit.DataRelease.FAQ.Cited.Answer2.Link</a>,
                                    <span translate>Toolkit.DataRelease.FAQ.Cited.Answer2.Part2</span>
                                </p>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.Cited.Answer3</p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Appendices.Title</h2>
                                <ul class="PageContent-ul">
                                    <ng-container *ngFor="let item of 'Toolkit.DataRelease.FAQ.Appendices.List' | translate">
                                        <li class="PageContent-text PageContent-text-list">
                                            <a [href]="item.PDF" target="_blank" class="Link">{{item.Link}}</a>
                                            <span>{{item.Text}}</span>
                                        </li>                             
                                    </ng-container>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.FAQ.Terminology.Title</h2>
                                <p class="PageContent-text" translate>Toolkit.DataRelease.FAQ.Terminology.Text</p>
                                <div id="NCITermDictionaryWidgetEnglish">
                                    <iframe lazy-resource
                                            frameborder="0"
                                            src="https://www.cancer.gov/widgets/TermDictionaryWidgetEnglish"
                                            id="NCITermDictionaryWidgetContainerEnglish"
                                            title="https://www.mbcproject.org/data-release"
                                            name="https://www.mbcproject.org/data-release"
                                            style="width: 100%; height: 300px;">
                                    </iframe>
                                </div>

                                <h2 class="PageContent-title" translate>
                                    Toolkit.DataRelease.DataBrowser.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.DataBrowser.Text1
                                </p>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.DataBrowser.Text2.Text</span>
                                    <a href="AboutYouSurvey.pdf" class="Link" target="_blank" translate>Toolkit.DataRelease.DataBrowser.Text2.Link</a>.
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.DataBrowser.List.Title
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" *ngFor="let item of 'Toolkit.DataRelease.DataBrowser.List.Items' | translate">
                                        {{item}}
                                    </li>
                                </ul>
                                <p class="PageContent-text" translate>
                                    <span translate>Toolkit.DataRelease.DataBrowser.Text3</span>
                                    <a [href]="dataEmailHref" class="Link">{{dataEmail}}</a>.  
                                </p>
                                <p class="PageContent-text" [innerHtml]="'Toolkit.DataRelease.DataBrowser.Text4' | translate"></p>
                                <p class="PageContent-text" translate>
                                    <span translate>Toolkit.DataRelease.DataBrowser.Text5.Part1</span>
                                    <a href="https://www.youtube.com/watch?v=16sok49U564" class="Link" target="_blank" translate>Toolkit.DataRelease.DataBrowser.Text5.Link</a>
                                    <span translate>Toolkit.DataRelease.DataBrowser.Text5.Part2</span>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </article>
        <article>
            <div class="tableau-iframe">
                <iframe frameborder="0" allowtransparency="true" allowfullscreen="true" marginheight="0" marginwidth="0" scrolling="no" [width]="iframeWidth" [height]="iframeHeight" 
                    src="https://public.tableau.com/views/AngiosarcomaProjectPatientReportedDataBrowser/ASCprojectPRD?%3Aembed=y&amp;%3AshowVizHome=no&amp;%3Adisplay_count=y&amp;%3Adisplay_static_image=y&amp;%3AbootstrapWhenNotified=true&amp;%3Alanguage=en&amp;:embed=y&amp;:showVizHome=n&amp;:apiID=host0#navType=0&amp;navSrc=Parse">
                </iframe>
            </div>
        </article>
    </div>`,
    styles: [`
        .PageContent-title, .PageContent-subtitle {
            color: black;
        }

        .PageContent-ul li, ul li.PageContent-text {
            padding: 0;
            margin: 10px 0;
        }

        .margin-top {
            margin: 20px 0 0 0;
        }

        .margin-top-bottom {
            margin: 20px 0;
        }

        .PageContent {
            padding: 50px 0 20px 0;
        }
    `],
})
export class DataReleaseComponent implements OnInit {
    public dataEmail: string;
    public dataEmailHref: string;
    public iframeWidth: number;
    public iframeHeight: number;

    constructor(
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.dataEmailHref = `mailto:${this.toolkitConfiguration.dataEmail}`;
        this.iframeWidth = this.isMobile ? 400 : 1200;
        this.iframeHeight = this.isMobile ? 300 : 930;
    }

    public openDisclaimerDialog(): void {
        this.dialog.open(DisclaimerComponent, {
            width: '740px',
            position: { top: '30px' },
            data: {},
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy()
        });
    }

    public get isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
