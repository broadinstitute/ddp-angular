import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowRef } from 'ddp-sdk';
import { BaseFooterComponent } from './base-footer/base-footer.component';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../utils/join-mailing-list-dialog-confg';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseFooterComponent {
    @Input() isPediHCCTheme: boolean;
    @Input() phone: string;
    @Input() email: string;

    constructor(
        private _windowRef: WindowRef,
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        super(_windowRef);
    }

    public openJoinMailingList(): void {
        const info = ['Pedihcc'];
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info },
        });

    }

    public get copyrightYear(): number {
        if (this.isPediHCCTheme) {
            return 2023;
        }
        return 2021;
    }
}
