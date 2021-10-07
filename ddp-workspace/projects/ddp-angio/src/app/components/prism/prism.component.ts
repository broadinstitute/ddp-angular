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
                <div class="PageLayout-prism">
                    <ddp-prism></ddp-prism>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .PageLayout-prism {
            padding: 0 35px;
        }
    `]
})
export class PrismComponent {
}
