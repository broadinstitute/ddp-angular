import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-participant-deletion-dialog',
  templateUrl: './participant-deletion-dialog.component.html',
  styleUrls: ['./participant-deletion-dialog.component.scss'],
})
export class ParticipantDeletionDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ParticipantDeletionDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
