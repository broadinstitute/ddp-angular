import { Component, Inject, OnInit } from '@angular/core';
import { StayInformedComponent } from './stay-informed.component';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-stay-informed-redesigned',
    template: `
        <main class="main">
            <section class="section static-page-title-section">
                <div class="content content_tight">
                    <h1 translate>Toolkit.StayInformed.Title</h1>
                </div>
            </section>
            <section class="section static-page-content-section">
                <div class="content content_tight">
                    <p>
                        <span translate>Toolkit.StayInformed.Text</span>
                        <a [href]="infoEmailHref" class="Link">{{ infoEmail }}</a>.
                    </p>
                    <div class="stay-informed-button">
                        <a routerLink="/" class="button button_medium button_primary" translate>
                            Common.Buttons.ReturnHome
                        </a>
                    </div>
                </div>
            </section>
        </main>`
})
export class StayInformedRedesignedComponent extends StayInformedComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
        super(toolkitConfiguration);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
    }
}
