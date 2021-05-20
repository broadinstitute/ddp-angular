import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'ddp-confirm-dialog',
    templateUrl: './confirmDialog.component.html',
    styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent {
    title: string;
    confirmBtnText: string;
    cancelBtnText: string;

    constructor(@Inject(MAT_DIALOG_DATA) data) {
        this.title = data.title;
        this.confirmBtnText = data.confirmBtnText;
        this.cancelBtnText = data.cancelBtnText;
    }
}
