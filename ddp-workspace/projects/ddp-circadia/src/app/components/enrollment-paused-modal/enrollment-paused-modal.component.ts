import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { first, take } from 'rxjs/operators';

import { ConfigurationService, MailingListServiceAgent } from 'ddp-sdk';

@Component({
  selector: 'app-enrollment-paused-modal',
  templateUrl: './enrollment-paused-modal.component.html',
  styleUrls: ['./enrollment-paused-modal.component.scss'],
})
export class EnrollmentPausedModalComponent implements OnInit {
  loading = false;
  form = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
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
    private router: Router,
    private dialogRef: MatDialogRef<EnrollmentPausedModalComponent>,
    private mailingListService: MailingListServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.scrollToTopAfterClosed();
  }

  scrollToTopAfterClosed(): void {
    this.dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(() => setTimeout(() => window.scrollTo(0, 0)));
  }

  onSubmit(): void {
    if (!this.form.valid || this.loading) {
      return;
    }

    this.form.disable();
    this.loading = true;

    const { firstName, lastName, email } = this.form.value;

    this.mailingListService
      .join({
        firstName,
        lastName,
        emailAddress: email,
        studyGuid: this.config.studyGuid,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  hasError(controlName: string, validatorName: string): boolean {
    const control = this.form.get(controlName);

    return control.errors && control.errors[validatorName];
  }
}
