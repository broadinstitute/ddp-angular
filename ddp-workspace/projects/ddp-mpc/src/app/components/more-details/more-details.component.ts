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
                        <h1 class="PageHeader-title" translate>
                            MoreDetails.Title
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <article class="PageContent">
            <div class="PageLayout row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section class="PageContent-section">
                        <p class="PageContent-text">
                            <span translate>MoreDetails.MainText.Pt1</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>MoreDetails.MainText.Pt2</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>
                            <span translate>MoreDetails.MainText.Pt3</span>
                        </p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>MoreDetails.HowProjectWorks.Title</h1>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.AboutYourself.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.AboutYourself.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.Permission.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.Permission.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.Request.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.Request.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.SendUs.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.SendUs.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.Analyze.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.Analyze.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.Share.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.Share.Text</p>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.HowProjectWorks.Learn.Title</h2>
                        <p class="PageContent-text" translate>MoreDetails.HowProjectWorks.Learn.Text</p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>MoreDetails.FAQ.Title</h1>
                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Goal.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Goal.Section1</p>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Goal.Section2</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Research.Question</h2>
                        <p class="PageContent-text">
                            <span translate>MoreDetails.FAQ.Research.Text1</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>MoreDetails.FAQ.Research.Text2</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>
                            <span translate>MoreDetails.FAQ.Research.Text3</span>
                            <a [href]="countMeInUrl" class="Link" target="_blank" translate>MoreDetails.FAQ.Research.Link</a>.
                        </p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Involved.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Involved.Section1</p>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Involved.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Costs.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Costs.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Share.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Share.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.UsedUp.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.UsedUp.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.UsedUp.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.UsedUp.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Analyzed.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Analyzed.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Profit.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Profit.Section1</p>

                        <h2 class="PageContent-subtitle" translate>MoreDetails.FAQ.Info.Question</h2>
                        <p class="PageContent-text" translate>MoreDetails.FAQ.Info.Text</p>
                        <p class="PageContent-text">
                            <a href="physician.pdf" target="_blank" class="Link" translate>MoreDetails.FAQ.Info.Link</a>
                        </p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>MoreDetails.FAQ.OtherQuestions.Title</h1>
                        <p class="PageContent-text">
                            <span translate>MoreDetails.FAQ.OtherQuestions.Section1.Text</span>
                            <a href="MPC_Brochure.pdf" target="_blank" class="Link" translate> MoreDetails.FAQ.OtherQuestions.Section1.Link</a>.
                        </p>
                        <p class="PageContent-text">
                            <span translate>MoreDetails.FAQ.OtherQuestions.Section2.TextPt1</span>
                            <a class="Link" [href]="infoEmailHref">{{ infoEmail }}</a>
                            <span translate>MoreDetails.FAQ.OtherQuestions.Section2.TextPt2</span>
                            <a class="Link" [href]="phoneHref">{{phone}}</a>.
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

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.phone = this.toolkitConfiguration.phone;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
    }
}
