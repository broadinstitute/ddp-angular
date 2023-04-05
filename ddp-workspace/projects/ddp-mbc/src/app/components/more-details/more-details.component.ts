
import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { Observable } from 'rxjs';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
    selector: 'app-more-details',
    template: `
    <toolkit-header [showButtons]="true" [showLanguageSelector]="true"></toolkit-header>
    <div class="Wrapper">
        <div class="PageHeader">
            <div class="PageHeader-background">
                <div class="PageLayout">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h1 class="PageHeader-title" translate>
                            Toolkit.MoreDetails.Title
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
                            <span translate>Toolkit.MoreDetails.MainText.Section1.Pt1</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>Toolkit.MoreDetails.MainText.Section1.Pt2</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>
                            <span translate>Toolkit.MoreDetails.MainText.Section1.Pt3</span>
                        </p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.MainText.Section2</p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.HowProjectWorks.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.AboutYourself.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.AboutYourself.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Permission.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Permission.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Request.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Request.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.SendUs.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.SendUs.Text</p>
                        <div class="PageContent-video">
                            <iframe lazy-resource class="PageContent-video--iframe" src="https://www.youtube.com/embed/_dKSNMarRuA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Analyze.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Analyze.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Share.Title</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.HowProjectWorks.Share.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Title</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.HowProjectWorks.Learn.TextPt1</span>
                            <a [href]="twitterUrl" class="Link" target="_blank" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Socials.Twitter</a>,
                            <a [href]="facebookUrl$ | async" class="Link" target="_blank" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Socials.Facebook</a>
                            <span translate>Toolkit.MoreDetails.HowProjectWorks.Learn.TextPt2</span>
                            <a [href]="instagramUrl" class="Link" target="_blank" translate>Toolkit.MoreDetails.HowProjectWorks.Learn.Socials.Instagram</a>.
                        </p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.FAQ.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Goal.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section2</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Goal.Section3</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Conduct.Question</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt1</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>,
                            <span translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt2</span>
                            <a [href]="countMeInUrl" class="Link Italic" target="_blank" translate>Toolkit.Common.Organization</a>
                            <span translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt3</span>
                            <a class="Link" [href]="countMeInUrl" target="_blank" translate>Toolkit.MoreDetails.FAQ.Conduct.Text.Pt4</a>.
                        </p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Section1</p>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.InvolvedInProject.Section2</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Costs.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Costs.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TumorTissue.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TumorTissue.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TissueSample.Question</h2>
                        <p class="PageContent-text" [innerHTML]="'Toolkit.MoreDetails.FAQ.TissueSample.Text' | translate"></p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.TissueAndMedicalRecords.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.TissueAndMedicalRecords.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.Profit.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.FAQ.Profit.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Question</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Text</span>
                            <a href="For_Your_Physician_MBC_new_DFCI_Logo.pdf" target="_blank" class="Link" translate>Toolkit.MoreDetails.FAQ.InfoForPhysicians.Link</a>
                        </p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.FAQ.AggregatedData.Question</h2>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.AggregatedData.Text</span>
                            <a [routerLink]="['/data-release']" class="Link" translate>mbcproject.org/data-release</a>.
                        </p>
                    </section>
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Title</h1>
                        <p class="PageContent-text">
                            <span translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section1.TextPt1</span>
                            <a [href]="'Toolkit.MoreDetails.FAQ.OnePagerDocument' | translate" target="_blank" class="Link" translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section1.Link</a><span translate>Toolkit.MoreDetails.FAQ.OtherQuestions.Section1.TextPt2</span>
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
    public facebookUrl$: Observable<string>;
    public twitterUrl: string;
    public instagramUrl: string;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
                private ngxTranslate: NGXTranslateService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.phone = this.toolkitConfiguration.phone;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
        this.facebookUrl$ = this.ngxTranslate.getTranslation('Toolkit.Footer.FacebookLink');
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
    }
}
