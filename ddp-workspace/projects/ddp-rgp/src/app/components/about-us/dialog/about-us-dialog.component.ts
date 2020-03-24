import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../dialogData';

@Component({
    selector: 'app-about-us-dialog',
    templateUrl: './about-us-dialog.component.html',
    styleUrls: ['./about-us-dialog.component.scss']
})
export class AboutUsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AboutUsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}
