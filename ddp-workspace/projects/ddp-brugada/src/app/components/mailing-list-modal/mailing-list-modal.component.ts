import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mailing-list-modal',
  templateUrl: './mailing-list-modal.component.html',
  styleUrls: ['./mailing-list-modal.component.scss']
})
export class MailingListModalComponent implements OnInit {
  loading = false;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    emailConfirmation: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  },
    (formGroup: FormGroup) => {
      if (Object.values(formGroup.controls).some(control => control.invalid)) {
        return null;
      }

      const { email, emailConfirmation } = this.form.value;
      const same = email === emailConfirmation;

      if (!same) {
        formGroup
          .get('emailConfirmation')
          .setErrors({ emailsDoNotMatch: true });
      } else {
        formGroup.get('emailConfirmation').setErrors(null);
      }
    },
  );

  constructor(
    private dialogRef: MatDialogRef<MailingListModalComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

  }
}
