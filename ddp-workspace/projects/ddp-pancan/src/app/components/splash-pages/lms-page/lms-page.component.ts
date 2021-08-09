import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';

@Component({
  selector: 'app-lms-page',
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.scss']
})
export class LmsPageComponent {
    readonly phone: string;
    readonly email: string;
    readonly AppRoutes = AppRoutes;

    constructor(
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) {
        this.phone = config.lmsPagePhone;
        this.email = config.lmsPageEmail;
    }

    notify(): void {
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: {
                studyGuid: this.config.lmsStudyGuid
            },
        });
    }
}
