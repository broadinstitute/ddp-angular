import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { first, take } from 'rxjs/operators';

import { ConfigurationService, MailingListServiceAgent } from 'ddp-sdk';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-mailing-list-modal',
  templateUrl: './mailing-list-modal.component.html',
  styleUrls: ['./mailing-list-modal.component.scss'],
})
export class MailingListModalComponent implements OnInit {
  loading = false;
  form = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
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
    private router: Router,
    private dialogRef: MatDialogRef<MailingListModalComponent>,
    private mailingListService: MailingListServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.scrollToTopAfterClosed();
  }

  scrollToTopAfterClosed(): void {
    this.dialogRef
      .afterClosed()
      .pipe(
        first()
      )
      .subscribe(
        () => setTimeout(
          () => window.scrollTo(0, 0)
        )
      );
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

        this.router.navigateByUrl(Route.StayInformed);
      });
  }

  onClose(): void {
    this.dialogRef.close();

    this.router.navigateByUrl(Route.Home);
  }

  hasError(controlName: string, validatorName: string): boolean {
    const control = this.form.get(controlName);

    return control.errors && control.errors[validatorName];
  }
}
