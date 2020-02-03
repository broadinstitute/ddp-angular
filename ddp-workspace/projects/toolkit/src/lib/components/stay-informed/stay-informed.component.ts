import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
    selector: 'toolkit-stay-informed',
    template: `
        <toolkit-header [showButtons]="true"></toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" [innerHTML]="'Toolkit.StayInformed.Title' | translate"></h1>
                        </div>
                    </div>
                </div>
            </div>
            <article class="PageContent">
                <div class="PageLayout">
                    <div class="row NoMargin">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <section class="PageContent-section">
                                <p class="PageContent-text">
                                    <span [innerHTML]="'Toolkit.StayInformed.Text' | translate"></span>
                                    <a [href]="infoEmailHref" class="Link">{{ infoEmail }}</a>.
                                </p>
                                <hr class="HorizontalLine">
                                <div class="row topMarginMedium">
                                    <a class="ButtonFilled Float--right"
                                       [routerLink]="['/']"
                                       [innerHTML]="'Toolkit.StayInformed.ReturnButton' | translate">
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>`
})
export class StayInformedComponent implements OnInit {
    public infoEmail: string;
    public infoEmailHref: string;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
    }
}
