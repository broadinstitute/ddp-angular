import { Component } from '@angular/core';

@Component({
    selector: 'app-prism',
    template: `
        <toolkit-header [showButtons]="false"></toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background"></div>
            </div>
            <div class="PageContent">
                <div class="PageLayout PageLayout-prism">
                    <ddp-prism dashboardRoute="dashboard" [withLegacyId]="true"></ddp-prism>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .PageLayout-prism {
            max-width: 1200px !important;
            padding: 0 30px;
        }
    `]
})
export class PrismComponent {
}
