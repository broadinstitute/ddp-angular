import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';
import { LMS_PAGE_PATH } from '../../faq-section/faq-section.component';

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
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        private activatedRoute: ActivatedRoute
    ) {
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    }

    public openJoinMailingList(): void {
        const info = this.isColorectal ? ['Colorectal'] : null;
        const studyGuid = (this.isLmsPage && this.toolkitConfiguration.lmsStudyGuid) || undefined;
        let data: any = { info };
        if (studyGuid) {
            data = {...data, studyGuid };
        }

        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data,
        });
    }

    private get isLmsPage(): boolean {
        return this.activatedRoute.snapshot.routeConfig?.path === LMS_PAGE_PATH;
    }
}
