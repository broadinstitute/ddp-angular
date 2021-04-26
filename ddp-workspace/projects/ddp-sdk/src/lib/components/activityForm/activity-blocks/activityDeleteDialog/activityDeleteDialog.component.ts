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

    closeDialog(): void {
        this.dialogRef.close();
    }
}
