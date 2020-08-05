import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DisclaimerComponent, ToolkitConfigurationService } from 'toolkit';
import { WindowRef } from 'ddp-sdk';

@Component({
    selector: 'data-release',
    styles: [`
    .PageContent-title, .PageContent-subtitle {
        color: black;
    }
    .PageContent-ul li, ul li.PageContent-text {
        padding: 0;
        margin: 10px 0;
    }
    `],
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

        <article class="PageContent-top">
            <div class="PageLayout">
                <div class="row NoMargin">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section class="PageContent-section">
                            <div class="row NoMargin Left">
                                <button mat-button color="primary"
                                        class="ButtonFilled Button--rect"
                                        (click)="openDisclaimerDialog()"
                                        [innerHTML]="'Toolkit.DataRelease.ViewDataButton' | translate">
                                </button>
                            </div>
                            <div class="row topMarginMedium Left">
                                <button mat-button color="primary"
                                        class="ButtonFilled Button--rect"
                                        (click)="scrollTo(dataBrowser)"
                                        [innerHTML]="'Toolkit.DataRelease.ViewDataBrowser' | translate">
                                </button>
                            </div>
                            <div class="row topMarginBig">
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section1
                                </p>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section2
                                </p>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section3
                                </p>

                              <div class="row NoMargin Left">
                                <a href="http://em.rdcu.be/ls/click?upn=1VX9wGiUV7k-2FG8imEHteF25Ol5yBjR8SA-2FhQtoXbTgU-3DgnoE_eYO6zdaQoUubxrJz-2BH2Zv38FHa3PI5OJUb9BGSLB-2BF6glT83ifBpYralVEDHtm8fUe-2Fn2THVk97Rxygjq3vwNUApHjpwIHPbAn8NGj-2B4k4IRyGmAQwVgdtIxzIPwH4I5t0r5oau6ZlrcVrlqp9-2FKg4-2FwNLNPuZX3HycTX0v1XpUk2lh15XEgnM6M0A5rOIG1YGhUUshXmSFLbpMQGgGKsQb6ejoYL1PsmMQEhEJu94850We9c0axfNJM1lsMxWGnC83WszbjBFZwZBjJ5KrqH09R57ssi7kp2rpSMCUNxrEZfn-2BdVj0614MEOChUvTOT"
                                   target="_blank"
                                   style="margin-top:20px;">
                                  <button mat-button color="primary"
                                          class="ButtonFilled Button--rect"
                                          [innerHTML]="'Toolkit.DataRelease.ViewPaperButton' | translate">
                                  </button>  
                                </a>
                                
                              </div>
                              
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.InformationList.Title</h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item2</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item3</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item4</li>
                                </ul>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Contact.TextPt1</span>
                                    <a [href]="dataEmailHref" class="Link"> {{ dataEmail }} </a>
                                    <span translate>Toolkit.DataRelease.Contact.TextPt2</span>
                                </p>
                                <h2 class="PageContent-title" translate>Toolkit.DataRelease.BioPortal.Title</h2>
                                <p class="PageContent-text">
                                    <a class="Link" (click)="openDisclaimerDialog()" translate>Toolkit.DataRelease.BioPortal.Link</a>
                                </p>
                                <h2 class="PageContent-title" translate>
                                    Toolkit.DataRelease.AdditionalInfoTitle
                                </h2>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Goal.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Goal.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Difference.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Difference.Text
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Difference.ReasonsList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Difference.ReasonsList.Item2.Main</li>
                                    <ul>
                                        <li class="PageContent-text Sub-item" translate>Toolkit.DataRelease.Difference.ReasonsList.Item2.SubItem1</li>
                                        <li class="PageContent-text Sub-item" translate>Toolkit.DataRelease.Difference.ReasonsList.Item2.SubItem2</li>
                                        <li class="PageContent-text Sub-item" translate>Toolkit.DataRelease.Difference.ReasonsList.Item2.SubItem3</li>
                                    </ul>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Difference.ReasonsList.Item3</li>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Additional.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Additional.TextPt1
                                </p>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Additional.TextPt2
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item2</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item3</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item4</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item5</li>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.DataIncluded.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.DataIncluded.Text
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" [innerHtml]="'Toolkit.DataRelease.DataIncluded.DataList.Item1' | translate"></li>
                                    <li class="PageContent-text PageContent-text-list" [innerHtml]="'Toolkit.DataRelease.DataIncluded.DataList.Item2' | translate"></li>
                                    <li class="PageContent-text PageContent-text-list" [innerHtml]="'Toolkit.DataRelease.DataIncluded.DataList.Item3' | translate"></li>
                                    <li class="PageContent-text PageContent-text-list" [innerHtml]="'Toolkit.DataRelease.DataIncluded.DataList.Item4' | translate"></li>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Resources.Title
                                </h2>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Resources.TextPt1</span>
                                    <a (click)="scrollTo(glossary)" class="Link" translate> Toolkit.DataRelease.Resources.Link </a>
                                    <span translate>Toolkit.DataRelease.Resources.TextPt2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Cite.Title
                                </h2>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Cite.TextPt1</span>
                                    <a [href]="dataEmailHref" class="Link"> {{ dataEmail }} </a>
                                    <span translate>Toolkit.DataRelease.Cite.TextPt2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Unknown.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Unknown.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Samples.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Samples.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Sequence.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Sequence.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Inform.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Inform.Text
                                </p>
                                <h2 class="PageContent-title" translate>
                                    Toolkit.DataRelease.Appendices.Title
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="Methods.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item1.Link </a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item1.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="AboutYouSurvey.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item2.Link </a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item2.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="ConsentAndRelease.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item3.Link </a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item3.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="SalivaSampleInstructions.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item4.Link </a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item4.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="BloodSampleInstructions.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item5.Link </a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item5.Text</span>
                                    </li>
                                </ul>
                                <h2 #glossary class="PageContent-title" translate>
                                    Toolkit.DataRelease.Glossary.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Glossary.Text
                                </p>
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
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Glossary.Additional.TextPt1</span>
                                    <a [href]="dataEmailHref" class="Link"> {{ dataEmail }} </a>
                                    <span translate>Toolkit.DataRelease.Glossary.Additional.TextPt2</span>
                                </p>
                                <h2 #dataBrowser class="PageContent-title" translate>
                                    The Angiosarcoma Project Patient Data Browser
                                </h2>
                                <p class="PageContent-text" translate>
                                    Below is an interactive data browser for exploring the patient-reported data of the Angiosarcoma Project. Data depicted in the browser is from consented ASCproject patients in the USA and Canada.  
                                </p>
                                <p class="PageContent-text" translate>
                                    <span>Patient-reported data included here are from patients who completed the following ASCproject intake survey. An example of what patients see when they sign up is linked here:</span>
                                    <a href="AboutYouSurvey.pdf" class="Link">Initial intake survey</a>.
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    How to use the interactive data browser:
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item2</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item3</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Additional.FieldsList.Item4</li>
                                </ul>
                                <p class="PageContent-text" translate>
                                    <span>This data will be updated periodically as new patient-reported data is generated, such as when new patients join the project or as new surveys are deployed. If you have any questions or feedback, please email</span>
                                    <a [href]="dataEmailHref" class="Link">{{dataEmail}}</a>.  
                                </p>
                                <p class="PageContent-text" translate>
                                    Thank you to every patient who has said <i>Count Me In</i> and generously shared their experiences, information, and samples to accelerate discoveries. 
                                </p>
                                <p class="PageContent-text" translate>
                                    <span>Here is a</span>
                                    <a href="https://www.youtube.com/watch?v=16sok49U564&feature=youtu.be" class="Link" translate>walkthrough video</a>.  
                                    <span>on how to use a similar interactive data browser to explore patient survey data.</span>
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
    </div>`
})
export class DataReleaseComponent implements OnInit {
    public dataEmail: string;
    public dataEmailHref: string;
    public iframeWidth: number;
    public iframeHeight: number;

    constructor(
        private dialog: MatDialog,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.dataEmailHref = `mailto:${this.toolkitConfiguration.dataEmail}`;
        this.iframeWidth = this.isMobile ? 400 : 1200;
        this.iframeHeight = this.isMobile ? 300 : 930;
    }

    public scrollTo(target): void {
        target.scrollIntoView();
        this.windowRef.nativeWindow.scrollBy(0, -100);
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
