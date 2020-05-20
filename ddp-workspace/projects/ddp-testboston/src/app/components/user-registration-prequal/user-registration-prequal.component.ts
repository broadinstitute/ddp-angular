import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolkitConfigurationService } from 'toolkit';
import { Auth0AdapterService, InvitationServiceAgent } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
  selector: 'user-registration-prequal',
  templateUrl: './user-registration-prequal.component.html',
  styleUrls: ['./user-registration-prequal.component.scss']
})
export class UserRegistrationPrequalComponent implements OnInit {
  public formGroup: FormGroup;
  public errorMessage: string | null = null;

  constructor(
    private auth0: Auth0AdapterService,
    private invitationService: InvitationServiceAgent,
    @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.initForm();
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

  private initForm(): void {
    this.formGroup = new FormGroup({
      recaptchaToken: new FormControl(null, Validators.required),
      invitationId: new FormControl(null, Validators.required),
      zip: new FormControl(null, Validators.required)
    });
  }
}
