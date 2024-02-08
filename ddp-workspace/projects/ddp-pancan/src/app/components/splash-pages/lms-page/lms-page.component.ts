import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { LoggingService } from 'ddp-sdk';
import { AppRoutes } from '../../app-routes';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';

@Component({
  selector: 'app-lms-page',
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.scss']
})
export class LmsPageComponent implements OnInit {
    readonly phone: string;
    readonly email: string;
    readonly AppRoutes = AppRoutes;

    constructor(
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService,
        private translateService: TranslateService,
        private log: LoggingService
    ) {
        this.phone = config.lmsPagePhone;
        this.email = config.lmsPageEmail;
    }

    openJoinMailingList(): void {
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: {
                studyGuid: this.config.lmsStudyGuid,
                useLanguage: 'en'
            },
        });
    }

    ngOnInit(): void {
        this.useSpecificLanguage('en');
        // PEPPER-1327: If user opens /lms page, redirects url to lmsproject.og
        window.location.href = 'https://lmsproject.org/';
    }

    private useSpecificLanguage(languageCode: string): void {
        this.translateService.getTranslation(languageCode)
            .pipe(
                catchError(err => {
                    this.log.logError(`LmsPageComponent: There is no translations for language: ${languageCode}`, err);
                    return EMPTY;
                }),
                take(1)
            )
            .subscribe();
    }
}
