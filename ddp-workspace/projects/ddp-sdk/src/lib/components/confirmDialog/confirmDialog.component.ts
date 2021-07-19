import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'ddp-confirm-dialog',
    templateUrl: './confirmDialog.component.html',
    styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent {
    title: string;
    content?: string[];
    contentSubstitutions?: object;
    confirmBtnText: string;
    cancelBtnText: string;
    confirmBtnColor: ThemePalette;

    constructor(@Inject(MAT_DIALOG_DATA) data) {
        this.title = data.title;
        this.content = data.content || [];
        this.contentSubstitutions = {...data.contentSubstitutions};
        this.confirmBtnText = data.confirmBtnText;
        this.cancelBtnText = data.cancelBtnText;
        this.confirmBtnColor = data.confirmBtnColor;
    }
}
