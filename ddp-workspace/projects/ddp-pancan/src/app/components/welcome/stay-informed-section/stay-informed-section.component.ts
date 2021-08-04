import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AppRoutes } from '../../app-routes';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';

@Component({
    selector: 'app-stay-informed-section',
    templateUrl: './stay-informed-section.component.html',
    styleUrls: ['./stay-informed-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StayInformedSectionComponent {
    @Input() isColorectal: boolean;
    readonly AppRoutes = AppRoutes;
    readonly twitterUrl: string;
    readonly facebookUrl: string;

    constructor(
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService
    ) {
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    }

    public openJoinMailingList(): void {
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info: this.isColorectal ? ['Colorectal'] : null },
        });
    }
}
