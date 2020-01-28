import { Component, OnInit } from '@angular/core';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-accept-age-up-page',
    template: `
    <main class="main">
        <section class="section section-spinner">
            <div class="content content_medium">
                <ddp-accept-age-up></ddp-accept-age-up>
            </div>
        </section>
    </main>`
})
export class AcceptAgeUpPageComponent implements OnInit {
    constructor(private headerConfig: HeaderConfigurationService) { }

    public ngOnInit(): void {
        this.headerConfig.setupDefaultHeader();
    }
}
