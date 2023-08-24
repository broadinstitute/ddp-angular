import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { JoinMailingListComponent } from 'toolkit';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../utils/join-mailing-list-dialog-confg';

@Component({
    selector: 'app-faq-section',
    templateUrl: './faq-section.component.html',
    styleUrls: ['./faq-section.component.scss']
})
export class FaqSectionComponent {
    @Input() questions: string;
    @Input() questionsCount: number; /* don't pass the counter for displaying all questions */
    @Input() isColorectal: boolean;
    @Input() isPedihcc: boolean;
    @ViewChild(MatAccordion) accordion: MatAccordion; /* Please, do not remove. It is used outside of the component */

    constructor(private dialog: MatDialog) {}

    public openJoinMailingList(): void {
        const info = this.isColorectal ? ['Colorectal'] : this.isPedihcc ? ['Pedihcc'] : null;
        this.dialog.open(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info }
        });
    }
}
