import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'ddp-activity-delete-dialog',
    templateUrl: './activityDeleteDialog.component.html',
    styleUrls: ['./activityDeleteDialog.component.scss']
})
export class ActivityDeleteDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ActivityDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private modalData: any
    ) {
    }

    delete(): void {
        if (this.modalData && this.modalData.actionCallback) {
            this.modalData.actionCallback();
        }
        this.closeDialog();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
