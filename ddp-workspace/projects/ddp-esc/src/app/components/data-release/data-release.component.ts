import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'data-release',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
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
            <div class="PageLayout row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section class="PageContent-section">
                        <h2 class="PageContent-title" translate>DataRelease.DataBrowser</h2>
                        <p class="PageContent-text" translate>DataRelease.BrowserText</p>
                        <p class="PageContent-text" translate>DataRelease.PatientReported</p>

                        <ul class="PageContent-ul">
                        <li>
                            <a href="ESC_InitialIntakeSurvey.pdf" target="_blank" class="Link" translate>DataRelease.InitialSurvey</a>
                        </li>
                        </ul>

                        <h3 class="PageContent-subtitle" translate>DataRelease.DataUse.Text</h3>
                        <ul class="PageContent-ul">
                            <ng-container *ngFor="let item of 'DataRelease.DataUse.List' | translate">
                                <li>{{item}}</li>
                            </ng-container>
                        </ul>

                        <p class="PageContent-text">
                            <span translate>DataRelease.Updated</span>
                            <a class="Link" [href]="dataEmailHref">{{ dataEmail }}</a>.
                        </p>

                        <p class="PageContent-text" [innerHtml]="'DataRelease.ThankYou' | translate"></p>

                        <p class="PageContent-text">
                            <span translate>DataRelease.Video.Part1</span>
                            <a href="https://www.youtube.com/watch?v=16sok49U564&feature=youtu.be" target="_blank" class="Link" translate>
                                DataRelease.Video.Link
                            </a>
                            <span translate>DataRelease.Video.Part2</span>
                        </p>
                    </section>
                </div>
            </div>

            <div class="CenterDivTableau">
                <iframe frameborder="0" src="https://public.tableau.com/views/ESCPRDDataBrowser/Dashboardfinal2?:showVizHome=no&:embed=true"
                        [title]="'DataRelease.Tableau' | translate" [name]="'DataRelease.Tableau' | translate"
                        style="width: 100%; height: 840px"></iframe>
            </div>
        </article>
    </div>
    `
})
export class DataReleaseComponent implements OnInit {
    public dataEmail: string;
    public dataEmailHref: string;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.dataEmailHref = `mailto:${this.dataEmail}`;
    }
}
