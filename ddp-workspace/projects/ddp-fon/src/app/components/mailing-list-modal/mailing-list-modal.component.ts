import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { ConfigurationService, MailingListServiceAgent } from 'ddp-sdk';

@Component({
  selector: 'app-mailing-list-modal',
  templateUrl: './mailing-list-modal.component.html',
  styleUrls: ['./mailing-list-modal.component.scss'],
})
export class MailingListModalComponent {
  loading = false;
  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      emailConfirmation: new FormControl('', [Validators.required, Validators.email]),
    },
    (formGroup: FormGroup) => {
      if (Object.values(formGroup.controls).some(control => control.invalid)) {
        return null;
      }

      const { email, emailConfirmation } = this.form.value;
      const same = email === emailConfirmation;

      if (!same) {
        formGroup.get('emailConfirmation').setErrors({ emailsDoNotMatch: true });
      } else {
        formGroup.get('emailConfirmation').setErrors(null);
      }
    },
  );

  constructor(
    private dialogRef: MatDialogRef<MailingListModalComponent>,
    private mailingListService: MailingListServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.form.valid || this.loading) {
      return;
    }

    this.form.disable();
    this.loading = true;

    const { email } = this.form.value;

    this.mailingListService
      .join({
        firstName: '',
        lastName: '',
        emailAddress: email,
        studyGuid: this.config.studyGuid,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
