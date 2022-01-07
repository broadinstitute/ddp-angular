import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolkitConfigurationService } from 'toolkit';
import { Auth0AdapterService, InvitationServiceAgent, DdpError, ErrorType } from 'ddp-sdk';
import { merge, of, Subscription } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { RECAPTCHA_LANGUAGE, RecaptchaComponent } from 'ng-recaptcha';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-registration-prequal',
  templateUrl: './user-registration-prequal.component.html',
  styleUrls: ['./user-registration-prequal.component.scss']
})
export class UserRegistrationPrequalComponent implements OnInit, OnDestroy {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public formGroup: FormGroup;
  public error: DdpError | null = null;
  public errorType = ErrorType;
  @ViewChild('captcha', { static: false }) private captcha: RecaptchaComponent;
  private anchor = new Subscription();

  constructor(
    private auth0: Auth0AdapterService,
    private invitationService: InvitationServiceAgent,
    @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService,
    @Inject(RECAPTCHA_LANGUAGE) private recaptchaLanguage,
    private translateService: TranslateService) { }

  public ngOnInit(): void {
    // recaptcha language can only be initialized only once globally
    // if there is a language mismatch or the language is changed we need to force
    // a reload of application to initialize recaptcha with the same language as the translation service
    this.anchor.add(merge(
      of(this.translateService.currentLang).pipe(filter(currentLang => currentLang !== this.recaptchaLanguage)),
      this.translateService.onLangChange.asObservable()
    ).subscribe(() => {
      window.location.reload();
    }));
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
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
    this.anchor.add(this.formGroup.valueChanges.subscribe(() => {
      this.error = null;
    }));
  }

  private checkInvitation(invitationId: string, recaptchaToken: string, zip: string): void {
    this.formGroup.disable();
    this.invitationService.check(invitationId, recaptchaToken, zip).pipe(
      take(1)
    ).subscribe({
      next: () => this.auth0.signup({ invitation_id: invitationId }),
      error: (error) => {
        this.formGroup.enable();
        this.captcha.reset();
        this.error = error;
      }
    });
  }

  private rejectRegistration(): void {
    this.captcha.reset();
    this.error = new DdpError('', ErrorType.MinorSubject);
  }
}
