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
        padding: 0 0 0 25px;
        margin: 35px 0 20px 0;
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
                            DataRelease.Title
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
                                        [innerHTML]="'DataRelease.ViewDataButton' | translate">
                                </button>
                            </div>
                            <div class="row topMarginMedium">
                                <p class="PageContent-text" translate>
                                    DataRelease.MainText.Section1
                                </p>
                                <p class="PageContent-text" translate>
                                    DataRelease.MainText.Section2
                                </p>
                                <p class="PageContent-text" translate>
                                    DataRelease.MainText.Section3
                                </p>
                                <h2 class="PageContent-subtitle" translate>DataRelease.InformationList.Title</h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text" translate>DataRelease.InformationList.Item1</li>
                                    <li class="PageContent-text" translate>DataRelease.InformationList.Item2</li>
                                    <li class="PageContent-text" translate>DataRelease.InformationList.Item3</li>
                                    <li class="PageContent-text" translate>DataRelease.InformationList.Item4</li>
                                </ul>
                                <p class="PageContent-text">
                                    <span translate>DataRelease.InformationList.Text</span>
                                    <a [href]="dataEmailHref" class="Link">{{ dataEmail }}</a>.
                                </p>
                                <h2 class="PageContent-title" translate>DataRelease.BioPortal.Title</h2>
                                <p class="PageContent-text">
                                    <a class="Link" (click)="openDisclaimerDialog()" translate>DataRelease.BioPortal.Link</a>
                                </p>
                                <h2 class="PageContent-title" translate>
                                    DataRelease.AdditionalInfoTitle
                                </h2>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Goal.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Goal.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Difference.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Difference.Text
                                </p>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text" translate>DataRelease.Difference.ReasonsList.Item1</li>
                                    <li class="PageContent-text" translate>DataRelease.Difference.ReasonsList.Item2</li>
                                    <li class="PageContent-text" translate>DataRelease.Difference.ReasonsList.Item3</li>
                                    <li class="PageContent-text" translate>DataRelease.Difference.ReasonsList.Item4.Main</li>
                                    <ul>
                                        <li class="PageContent-text Sub-item" translate>DataRelease.Difference.ReasonsList.Item4.SubItem1</li>
                                        <li class="PageContent-text Sub-item" translate>DataRelease.Difference.ReasonsList.Item4.SubItem2</li>
                                        <li class="PageContent-text Sub-item" translate>DataRelease.Difference.ReasonsList.Item4.SubItem3</li>
                                    </ul>
                                    <li class="PageContent-text" translate>DataRelease.Difference.ReasonsList.Item5.Main</li>
                                    <ul>
                                        <li class="PageContent-text Sub-item" translate>DataRelease.Difference.ReasonsList.Item5.SubItem1</li>
                                        <li class="PageContent-text Sub-item" translate>DataRelease.Difference.ReasonsList.Item5.SubItem2</li>
                                    </ul>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Additional.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Additional.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.DataIncluded.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.DataIncluded.Text
                                </p>
                                <ul class="PageContent-ul">
                                    <li>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item1.Title</p>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item1.Text</p>
                                    </li>
                                    <li>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item2.Title</p>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item2.Text</p>
                                    </li>
                                    <li>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item3.Title</p>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item3.Text</p>
                                    </li>
                                    <li>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item4.Title</p>
                                        <p class="PageContent-text" translate>DataRelease.DataIncluded.List.Item4.Text</p>
                                    </li>
                                </ul>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Resources.Title
                                </h2>
                                <p class="PageContent-text">
                                    <span translate>DataRelease.Resources.TextPt1</span>
                                    <a (click)="scrollTo(glossary)" class="Link" translate>DataRelease.Resources.Link </a>
                                    <span translate>DataRelease.Resources.TextPt2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Cite.Title
                                </h2>
                                <p class="PageContent-text">
                                    <span translate>DataRelease.Cite.TextPt1</span>
                                    <a [href]="dataEmailHref" class="Link">{{ dataEmail }}</a>
                                    <span translate>DataRelease.Cite.TextPt2</span>
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Unknown.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Unknown.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Sequence.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Sequence.Text
                                </p>
                                <h2 class="PageContent-subtitle" translate>
                                    DataRelease.Inform.Title
                                </h2>
                                <p class="PageContent-text" [innerHTML]="'DataRelease.Inform.Text' | translate"></p>
                                <h2 class="PageContent-title" translate>
                                    DataRelease.Appendices.Title
                                </h2>
                                <ul class="PageContent-ul">
                                    <li class="PageContent-text">
                                        <a href="Methods.pdf" target="_blank" class="Link" translate>DataRelease.Appendices.AppendicesList.Item1.Link </a>
                                        <span translate>DataRelease.Appendices.AppendicesList.Item1.Text</span>
                                    </li>
                                    <li class="PageContent-text">
                                        <a href="AboutYouSurvey.pdf" target="_blank" class="Link" translate>DataRelease.Appendices.AppendicesList.Item2.Link </a>
                                        <span translate>DataRelease.Appendices.AppendicesList.Item2.Text</span>
                                    </li>
                                    <li class="PageContent-text">
                                        <a href="ConsentAndRelease.pdf" target="_blank" class="Link" translate>DataRelease.Appendices.AppendicesList.Item3.Link </a>
                                        <span translate>DataRelease.Appendices.AppendicesList.Item3.Text</span>
                                    </li>
                                    <li class="PageContent-text">
                                        <a href="SalivaSampleInstructions.pdf" target="_blank" class="Link" translate>DataRelease.Appendices.AppendicesList.Item4.Link </a>
                                        <span translate>DataRelease.Appendices.AppendicesList.Item4.Text</span>
                                    </li>
                                    <li class="PageContent-text">
                                        <a href="BloodSampleInstructions.pdf" target="_blank" class="Link" translate>DataRelease.Appendices.AppendicesList.Item5.Link </a>
                                        <span translate>DataRelease.Appendices.AppendicesList.Item5.Text</span>
                                    </li>
                                </ul>
                                <h2 #glossary class="PageContent-title" translate>
                                    DataRelease.Glossary.Title
                                </h2>
                                <p class="PageContent-text" translate>
                                    DataRelease.Glossary.Text
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
                                    <span translate>DataRelease.Glossary.Additional.TextPt1</span>
                                    <a [href]="dataEmailHref" class="Link">{{ dataEmail }}</a>
                                    <span translate>DataRelease.Glossary.Additional.TextPt2</span>
                                </p>
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
    public dataEmailHref: string;

    constructor(
        private dialog: MatDialog,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.dataEmailHref = `mailto:${this.toolkitConfiguration.dataEmail}`;
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
}
