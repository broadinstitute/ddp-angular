import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-patients-modal',
  templateUrl: './add-patients-modal.component.html',
  styleUrls: ['./add-patients-modal.component.scss'],
})
export class AddPatientsModalComponent {
  firstName$ = new BehaviorSubject('');
  lastName$ = new BehaviorSubject('');
  dateOfBirth$ = new BehaviorSubject('');
  email$ = new BehaviorSubject('');
  consentDate$ = new BehaviorSubject('');
  assentDate$ = new BehaviorSubject('');

  constructor(public dialogRef: MatDialogRef<AddPatientsModalComponent>) {}
  addNow(): void {
    console.log({
      firstName: this.firstName$.value,
      lastName: this.lastName$.value,
      dateOfBirth: this.dateOfBirth$.value,
      email: this.email$.value,
      consentDate: this.consentDate$.value,
      assentDate: this.assentDate$.value,
    });

    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close({
      firstName: this.firstName$.value,
      lastName: this.lastName$.value,
      dateOfBirth: this.dateOfBirth$.value,
      email: this.email$.value,
      consentDate: this.consentDate$.value,
      assentDate: this.assentDate$.value,
    });
  }
}
