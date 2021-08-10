import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JoinMailingListComponent, ToolkitConfigurationService } from 'toolkit';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../utils/join-mailing-list-dialog-confg';

export const LMS_PAGE_PATH = 'lms';

@Component({
    selector: 'app-faq-section',
    templateUrl: './faq-section.component.html',
    styleUrls: ['./faq-section.component.scss']
})
export class FaqSectionComponent {
    @Input() questions: string;
    @Input() questionsCount: number; /* don't pass the counter for displaying all questions */
    @Input() isColorectal: boolean;
    @ViewChild(MatAccordion) accordion: MatAccordion; /* Please, do not remove. It is used outside of the component */

    constructor(
        private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        private activatedRoute: ActivatedRoute
    ) {}

    public openJoinMailingList(): void {
        const info = this.isColorectal ? ['Colorectal'] : null;
        const studyGuid = this.isLmsPage && this.toolkitConfiguration.lmsStudyGuid;
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
