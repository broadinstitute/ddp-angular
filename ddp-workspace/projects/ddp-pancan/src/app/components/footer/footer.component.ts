import { Component, Inject } from '@angular/core';
import { WindowRef } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    readonly phone: string;
    readonly email: string;

    constructor(
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService) {
       this.phone = config.phone;
       this.email = config.infoEmail;
    }

    public goToTop(): void {
        this.windowRef.nativeWindow.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
