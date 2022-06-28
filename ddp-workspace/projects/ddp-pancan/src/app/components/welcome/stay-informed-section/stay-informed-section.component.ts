import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';
import { AnalyticsEventCategories, AnalyticsEventsService } from 'ddp-sdk';

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
    readonly instagramUrl: string;

    constructor(
        private dialog: MatDialog,
        private analytics: AnalyticsEventsService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService
    ) {
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
        this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
    }

    public openJoinMailingList(): void {
        const info = this.isColorectal ? ['Colorectal'] : null;
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info },
        });
    }

    public sendSocialMediaAnalytics(event: string): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
    }
}
