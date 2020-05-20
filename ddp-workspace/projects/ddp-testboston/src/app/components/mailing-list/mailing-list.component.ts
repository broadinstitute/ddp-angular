import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MailingListServiceAgent, Person } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss']
})
export class MailingListComponent implements OnInit {
  public mailingListForm: FormGroup;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public thankYou = false;
  public sorry = false;
  public error = true;
  public isLoading = false;
  private isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private mailingService: MailingListServiceAgent,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
    this.initForm();
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    if (this.mailingListForm.invalid) {
      return;
    }
    const isAdult = JSON.parse(this.mailingListForm.value.adult);
    if (isAdult) {
      this.subscribeToNewsletter();
    } else {
      this.declineSubscription();
    }
  }

  public onClose(key: string): void {
    this[key] = false;
    if (key !== 'error') {
      this.mailingListForm.reset();
      this.isSubmitted = false;
      this.ref.detectChanges();
    }
  }

  public fieldHasError(field: string, error: string): boolean {
    return this.isSubmitted && this.mailingListForm && this.mailingListForm.controls[field].errors
      && this.mailingListForm.controls[field].errors[error];
  }

  public get showSurvey(): boolean {
    return !this.thankYou && !this.sorry && !this.error && !this.isLoading;
  }

  private initForm(): void {
    this.mailingListForm = this.formBuilder.group({
      adult: new FormControl(null, Validators.required),
      bwhPatient: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\S+@\S+\.\S+$/)
      ])
    });
  }

  private subscribeToNewsletter(): void {
    this.isLoading = true;
    const bwhPatient = JSON.parse(this.mailingListForm.value.bwhPatient);
    const subject = this.createSubject(this.mailingListForm.value.email, bwhPatient);
    this.mailingService.join(subject).pipe(
      take(1),
      tap(() => this.isLoading = false)
    ).subscribe((response) => {
      if (response) {
        this.thankYou = true;
      } else {
        this.error = true;
      }
    });
  }

  private declineSubscription(): void {
    this.sorry = true;
  }

  private createSubject(emailAddress: string, bwhPatient: boolean | null): Person {
    const subjectInfo = JSON.stringify({
      over18: true,
      bwhPatient
    });
    return {
      firstName: '',
      lastName: '',
      emailAddress,
      info: [
        subjectInfo
      ],
      studyGuid: this.config.studyGuid
    };
  }
}
