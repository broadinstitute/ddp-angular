import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolkitConfigurationService } from 'toolkit';
import { Auth0AdapterService, InvitationServiceAgent, DdpError, ErrorType } from 'ddp-sdk';
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'user-registration-prequal',
  templateUrl: './user-registration-prequal.component.html',
  styleUrls: ['./user-registration-prequal.component.scss']
})
export class UserRegistrationPrequalComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public error: DdpError | null = null;
  public errorType = ErrorType;
  public isLoading = false;
  private anchor: Subscription;
  @ViewChild('captcha', { static: false }) private captcha: RecaptchaComponent;

  constructor(
    private auth0: Auth0AdapterService,
    private invitationService: InvitationServiceAgent,
    @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public onSubmit(): void {
    this.error = null;
    const form = this.formGroup.value;
    const isAdult = JSON.parse(form.adult);
    if (!isAdult) {
      this.rejectRegistration();
      return;
    }
    this.checkInvitation(form.invitationId,
      form.recaptchaToken,
      form.zip);
  }

  public hasInvitationError(errorType: ErrorType): boolean {
    return this.error && this.error.errorType === errorType;
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      invitationId: new FormControl(null, [Validators.required]),
      zip: new FormControl(null, [Validators.required]),
      adult: new FormControl(null, [Validators.required]),
      recaptchaToken: new FormControl(null, Validators.required)
    });
    this.anchor = this.formGroup.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  private checkInvitation(invitationId: string, recaptchaToken: string, zip: string): void {
    this.isLoading = true;
    this.invitationService.check(invitationId, recaptchaToken, zip).pipe(
      take(1),
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => this.auth0.signup({ invitation_id: invitationId }),
      (error) => {
        this.captcha.reset();
        this.error = error;
      }
    );
  }

  private rejectRegistration(): void {
    this.captcha.reset();
    this.error = new DdpError('', ErrorType.MinorSubject);
  }
}
