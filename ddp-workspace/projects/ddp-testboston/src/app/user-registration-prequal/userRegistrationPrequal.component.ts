import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolkitConfigurationService } from 'toolkit';
import { InvitationServiceAgent } from '../../../../ddp-sdk/src/lib/services/serviceAgents/invitationServiceAgent.service';
import { Auth0AdapterService } from 'ddp-sdk';
import { ErrorType } from '../models/errorType';

@Component({
  selector: 'app-user-registration-prequal',
  template: `
      <div *ngIf="errorMessage" class="ErrorMessage">
        <span>{{ errorMessage }}</span>
      </div>
      <form class="registration-prequal-form" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <mat-form-field class="example-input-field" floatLabel="always">
          <mat-label>Enter invitation code</mat-label>
          <input matInput
                 formControlName="invitationId"
                 maxlength="12"
                 minlength="12"
                 pattern="([a-zA-Z0-9]{4}){2}([a-zA-Z0-9]){4}"
                 placeholder="XXXXXXXXXXXXXXXX" uppercase>
        </mat-form-field>
        <mat-form-field class="example-input-field" floatLabel="always">
          <mat-label>What is your current mailing zip code?</mat-label>
          <input matInput
                 formControlName="zip"
                 minlength="5"
                 maxlength="5"
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
    this.invitationService.check(form.invitationId, form.recaptchaToken, form.zip).subscribe(
        () => this.auth0.signup({ invitation_id: form.invitationId }),
        (error) => {
          if (error.errorType === ErrorType.InvalidInvitation) {
            this.errorMessage = 'We got an invalid invitation';
          } else {
            this.errorMessage = 'Submission could not be processed';
            console.log('we got some sucky error');
          }
        }
    );
  }
}
