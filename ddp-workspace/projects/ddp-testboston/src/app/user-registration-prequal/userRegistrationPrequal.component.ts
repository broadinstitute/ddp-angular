import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolkitConfigurationService } from 'toolkit';
import { InvitationServiceAgent } from '../../../../ddp-sdk/src/lib/services/serviceAgents/invitationServiceAgent.service';
import { Auth0AdapterService } from 'ddp-sdk';
import { ErrorType } from '../models/errorType';
import { take } from 'rxjs/operators';

@Component({
  selector: 'user-registration-prequal',
  template: `
      <div *ngIf="errorMessage" class="ErrorMessage">
        <span>{{ errorMessage }}</span>
      </div>
      <form class="registration-prequal-form" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <mat-form-field class="example-input-field" floatLabel="always">
          <mat-label>Enter invitation code</mat-label>
          <input matInput
                 uppercase
                 formControlName="invitationId"
                 pattern="[a-zA-Z0-9]{12}"
                 maxLength="12"
                 placeholder="Your invitation code">
        </mat-form-field>
        <mat-form-field class="example-input-field" floatLabel="always">
          <mat-label>What is your current mailing zip code?</mat-label>
          <input matInput
                 formControlName="zip"
                 minlength="5"
                 maxlength="5"
                 placeholder="5 digit zip"
                 pattern="[0-9]{5}">
        </mat-form-field>
        <re-captcha [siteKey]="config.recaptchaSiteKey" size="normal" formControlName="recaptchaToken"></re-captcha>
        <button type="submit" [disabled]="formGroup.invalid" mat-raised-button color="primary">Submit</button>
      </form>
  `,
  styles: [`
      .registration-prequal-form {
        display: flex;
        flex-direction: column;
      }
  `]
})
export class UserRegistrationPrequalComponent {
  public formGroup: FormGroup;
  public errorMessage: string | null = null;

  constructor(private invitationService: InvitationServiceAgent,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService,
              private auth0: Auth0AdapterService) {
    this.formGroup = new FormGroup({
      recaptchaToken: new FormControl(null, Validators.required),
      invitationId: new FormControl(null, Validators.required),
      zip: new FormControl(null, Validators.required)
    });
  }

  public onSubmit(): void {
    this.errorMessage = null;
    const form = this.formGroup.value;
    this.invitationService
        .check(form.invitationId, form.recaptchaToken, form.zip)
        .pipe(take(1))
        .subscribe(
        () => this.auth0.signup({ invitation_id: form.invitationId }),
        (error) => {
          if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Submission could not be processed';
          }
        }
    );
  }
}
