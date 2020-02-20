import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DisclaimerComponent, ToolkitConfigurationService } from 'toolkit';

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

        <article class="PageContent">
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
                            <div class="row topMarginMedium">
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section1
                                </p>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section2
                                </p>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.MainText.Section3
                                </p>
                                <h2 class="PageContent-subtitle" translate>Toolkit.DataRelease.InformationList.Title</h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item2</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item3</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.InformationList.Item4</li>
                                </ul>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Contact.Text</span>
                                    <a [href]="dataEmailHref" class="Link">{{ dataEmail }}</a>.
                                </p>
                                <h2 class="PageContent-title" translate>Toolkit.DataRelease.BioPortal.Title</h2>
                                <p class="PageContent-text">
                                    <a class="Link" (click)="openDisclaimerDialog()" translate>Toolkit.DataRelease.BioPortal.Link</a>
                                </p>
                                <h2 class="PageContent-title" translate>
                                    Toolkit.DataRelease.AdditionalInfoTitle
                                </h2>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.AdditionalData.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.AdditionalData.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Involved.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Involved.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Different.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.Different.Text
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item1</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item2</li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item3.Text
                                        <ul class="PageContent-ul">
                                            <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item3.SubItem1</li>
                                            <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item3.SubItem2</li>
                                            <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item3.SubItem3</li>
                                            <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item3.SubItem4</li>
                                        </ul>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list" translate>Toolkit.DataRelease.Different.FieldsList.Item4</li>
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
                                    <a (click)="scrollTo(glossary)" class="Link" translate>Toolkit.DataRelease.Resources.Link</a>
                                    <span translate>Toolkit.DataRelease.Resources.TextPt2</span>
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
                                <p class="PageContent-text" [innerHtml]="'Toolkit.DataRelease.Inform.Text' | translate">
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.Biases.Title
                                </h2>
                                <h2 class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.Biases.Text</span>
                                    <a [href]="dataEmailHref" class="Link">{{ infoEmail }}</a>.
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="Methods.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item1.Link</a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item1.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="AboutYouSurvey.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item2.Link</a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item2.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="ConsentAndRelease.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item3.Link</a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item3.Text</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="SalivaSampleInstructions.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.Appendices.AppendicesList.Item4.Link</a>
                                        <span translate>Toolkit.DataRelease.Appendices.AppendicesList.Item4.Text</span>
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
                                    Toolkit.DataRelease.DataBrowser.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    Toolkit.DataRelease.DataBrowser.Main.Intro
                                </p>
                                <p class="PageContent-text NoMargin" translate>
                                    Toolkit.DataRelease.DataBrowser.Main.List.Intro
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="AboutYouSurvey.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.DataBrowser.Main.List.Item1</a>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <a href="FollowUpSurvey.pdf" target="_blank" class="Link" translate>Toolkit.DataRelease.DataBrowser.Main.List.Item2</a>
                                    </li>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    Toolkit.DataRelease.DataBrowser.HowToUse.Title
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text PageContent-text-list">
                                        <span translate>Toolkit.DataRelease.DataBrowser.HowToUse.List.Item1</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <span translate>Toolkit.DataRelease.DataBrowser.HowToUse.List.Item2</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <span translate>Toolkit.DataRelease.DataBrowser.HowToUse.List.Item3</span>
                                    </li>
                                    <li class="PageContent-text PageContent-text-list">
                                        <span translate>Toolkit.DataRelease.DataBrowser.HowToUse.List.Item4</span>
                                    </li>
                                </ul>
                                <p class="PageContent-text">
                                    <span translate>Toolkit.DataRelease.DataBrowser.HowToUse.Text1</span>
                                    <a [href]="dataEmailHref" class="Link">{{ dataEmail }}</a>.
                                </p>
                                <p class="PageContent-text" [innerHtml]="'Toolkit.DataRelease.DataBrowser.HowToUse.Text2' | translate"></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </article>
    </div>`
})
export class DataReleaseComponent implements OnInit {
    public dataEmail: string;
    public infoEmail: string;
    public dataEmailHref: string;

    constructor(private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.dataEmailHref = `mailto:${this.toolkitConfiguration.dataEmail}`;
    }

    public scrollTo(target): void {
        target.scrollIntoView();
        window.scrollBy(0, -100);
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
}
