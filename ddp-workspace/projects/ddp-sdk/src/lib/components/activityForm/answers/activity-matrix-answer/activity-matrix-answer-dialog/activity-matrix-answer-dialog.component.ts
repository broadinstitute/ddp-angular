import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData } from '../activity-matrix-answer.component';

@Component({
  selector: 'ddp-activity-matrix-answer-dialog',
  templateUrl: './activity-matrix-answer-dialog.component.html',
  styleUrls: ['./activity-matrix-answer-dialog.component.scss'],
})
export class ActivityMatrixAnswerDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ActivityMatrixAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
