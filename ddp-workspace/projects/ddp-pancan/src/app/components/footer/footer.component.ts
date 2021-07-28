import { Component, Inject } from '@angular/core';
import { WindowRef } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { BaseFooterComponent } from './base-footer/base-footer.component';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseFooterComponent {
    readonly phone: string;
    readonly email: string;

    constructor(
        private _windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService
    ) {
        super(_windowRef);
        this.phone = config.phone;
        this.email = config.infoEmail;
    }
}
