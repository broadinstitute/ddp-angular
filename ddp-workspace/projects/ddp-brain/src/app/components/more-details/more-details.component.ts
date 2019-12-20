import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'more-details',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
    <div class="Wrapper">
        <div class="PageHeader">
            <div class="PageHeader-background">
                <div class="PageLayout">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h1 class="PageHeader-title" [innerHTML]="'Toolkit.MoreDetails.Title' | translate">
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <article class="PageContent">
            <div class="PageLayout row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section class="PageContent-section">
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.MainText.Section1.Text1</p>
                        <p class="PageContent-text">
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>Toolkit.MoreDetails.MainText.Section1.Text2.Pt1</span>
                            <span class="Italic" translate>Toolkit.Common.Organization</span>
                            <span translate>Toolkit.MoreDetails.MainText.Section1.Text2.Pt2</span>
                        </p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.HowProjectWorks.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.AboutYourself.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.AboutYourself.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Permission.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Permission.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Request.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Request.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.SalivaSample.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.SalivaSample.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.BloodSample.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.BloodSample.Text1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.BloodSample.Text2</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Analyze.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Analyze.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Share.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Share.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Text</p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.FAQ.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Goal.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section2</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section3</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.GenomicResearch.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.GenomicResearch.Section1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.GenomicResearch.Section2</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.GenomicResearch.Section3</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Conduct.Question</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt1</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt2</span>
                            <a class="Link" [href]="aboutUsUrl" target="_blank" translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt3</a>.
                        </p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Section1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Section2</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Costs.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Costs.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TumorTissue.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TumorTissue.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TissueSample.Question</h2>
                        <p class="PageContent-text">
                            <span [innerHtml]="'Toolkit.MoreDetails.FAQ.TissueSample.Section1' | translate"></span>
                        </p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TissueSample.Section2</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TissueSample.Section3</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TissueAndMedicalRecords.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TissueAndMedicalRecords.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Profit.Question</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.Profit.Text.Pt1</span>
                            <span class="Semibold" translate>Toolkit.MoreDetails.FAQ.Profit.Text.Pt2</span>
                            <span translate>Toolkit.MoreDetails.FAQ.Profit.Text.Pt3</span>
                        </p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Text</p>
                        <p class="PageContent-text">
                            <a href="physician.pdf" target="_blank" class="Link" translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Link</a>
                        </p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.AnotherStudy.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.AnotherStudy.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.DataHoused.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.DataHoused.Text</p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Title</h1>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section1.Text</span>
                            <a href="BrainCancerBrochure.pdf" target="_blank" class="Link" translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section1.Link</a>
                        </p>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section2.TextPt1</span>
                            <a class="Link" [href]="infoEmailHref">{{ infoEmail }}</a>
                            <span translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section2.TextPt2</span>
                            <a class="Link" [href]="phoneHref">{{ phone }}</a>.
                        </p>
                    </section>
                </div>
            </div>
        </article>
    </div>
    `
})
export class MoreDetailsComponent implements OnInit {
    public infoEmail: string;
    public phone: string;
    public infoEmailHref: string;
    public phoneHref: string;
    public countMeInUrl: string;
    public aboutUsUrl: string;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.phone = this.toolkitConfiguration.phone;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
        this.aboutUsUrl = this.toolkitConfiguration.aboutUsUrl;
    }
}
