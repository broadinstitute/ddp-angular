import { Component, Inject } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { InternationalPatientsComponent } from './internationalPatients.component';

@Component({
    selector: 'toolkit-international-patients-redesigned',
    template: `
    <main class="main">
        <section class="section static-page-title-section">
            <div class="content content_tight">
                <h1 class="static-page-title-section__title" translate>Toolkit.InternationalPatients.Title</h1>
            </div>
        </section>
        <section class="section static-page-content-section">
            <div class="content content_tight">
                <div class="international-section">
                    <p>
                        <span translate>Toolkit.InternationalPatients.ThankYou.TextPt1</span>
                        <a [href]="emailHref" class="Link">{{email}}</a>
                        <span translate>Toolkit.InternationalPatients.ThankYou.TextPt2</span>
                        <a [href]="phoneHref" class="Link">{{phone}}</a>.
                    </p>
                    <p translate>Toolkit.InternationalPatients.Understand</p>s
                </div>
            </div>
        </section>
    </main>`
})
export class InternationalPatientsRedesignedComponent extends InternationalPatientsComponent {
    constructor(@Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService) {
        super(config);
    }
}
