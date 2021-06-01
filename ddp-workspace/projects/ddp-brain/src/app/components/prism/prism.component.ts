import { Component } from '@angular/core';

@Component({
    selector: 'app-prism',
    template: `
        <div class="content">
            <ddp-prism class="section_last"></ddp-prism>
        </div>`,
    styles: [`
        ddp-prism {
            display: block;
        }
    `]
})
export class PrismComponent {
}
