import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: 'confirmationModal.component.html',
  styleUrls: ['confirmationModal.component.scss']
})
export class ConfirmationModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {name: string},
  ) {}

  public confirmationAnswerIs(doIt: boolean): void {
    this.dialogRef.close(doIt);
  }

  public get name(): string {
    return this.data.name;
  }
}
