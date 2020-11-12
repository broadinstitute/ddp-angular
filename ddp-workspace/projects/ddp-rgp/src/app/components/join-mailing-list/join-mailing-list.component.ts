import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    AnalyticsEventActions,
    AnalyticsEventCategories,
    AnalyticsEventsService, CompositeDisposable,
    MailingListServiceAgent, Person
} from 'ddp-sdk';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';
import { Router } from '@angular/router';

@Component({
    selector: 'app-join-mailing-list',
    templateUrl: './join-mailing-list.component.html',
    styleUrls: ['./join-mailing-list.component.scss']
})
export class JoinMailingListComponent implements OnInit, OnDestroy {
    public joinForm: FormGroup;
    public isEmailsDifferent = false;
    public isLoadingError = false;
    public joinButtonDisabled = false;
    private studyGuid: string;
    private stayInformedUrl: string;
    private anchor: CompositeDisposable;
    private readonly EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

    constructor(
        private communicationService: CommunicationService,
        private router: Router,
        private formBuilder: FormBuilder,
        private mailingService: MailingListServiceAgent,
        private analytics: AnalyticsEventsService,
        private firstName: string,
        private lastName: string,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initJoinForm();
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        this.stayInformedUrl = this.toolkitConfiguration.stayInformedUrl;
        this.anchor = new CompositeDisposable();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public closeDialog(isSubmitted = false): void {
        if (isSubmitted) {
            this.router.navigateByUrl(this.stayInformedUrl);
        } else if (this.router.url.includes(this.toolkitConfiguration.mailingListDialogUrl)) {
            this.router.navigateByUrl('/');
        }
    }

    public submitForm(): void {
        this.isLoadingError = false;
        const controls = this.joinForm.controls;
        if (this.joinForm.invalid) {
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
            return;
        }
        const valid = this.compareEmails();
        if (valid) {
            return;
        }
        this.joinButtonDisabled = true;
        const person: Person = this.createPerson;
        this.analytics.emitCustomEvent(AnalyticsEventCategories.MailingList, AnalyticsEventActions.Join);
        const addPerson = this.mailingService.join(person).subscribe(
            x => {
                if (x) {
                    this.redirect();
                } else {
                    this.isLoadingError = true;
                    this.joinButtonDisabled = false;
                }
            });
        this.anchor.addNew(addPerson);
    }

    public isValid(controlName: string): boolean {
        const control = this.joinForm.controls[controlName];
        return control.invalid && control.touched;
    }

    private initJoinForm(): void {
        this.joinForm = this.formBuilder.group({
            firstName: [this.firstName ? this.firstName : '', Validators.required],
            lastName: [this.lastName ? this.lastName : '', Validators.required],
            email: ['', [Validators.required, Validators.pattern(this.EMAIL_REGEXP)]],
            confirmEmail: ['', [Validators.required, Validators.pattern(this.EMAIL_REGEXP)]]
        });
    }

    private compareEmails(): boolean {
        this.isEmailsDifferent = this.joinForm.value.email !== this.joinForm.value.confirmEmail;
        return this.isEmailsDifferent;
    }

    private get createPerson(): Person {
        return {
            firstName: this.joinForm.value.firstName,
            lastName: this.joinForm.value.lastName,
            emailAddress: this.joinForm.value.email,
            studyGuid: this.studyGuid
        };
    }

    private redirect(): void {
        this.closeDialog(true);
    }
}
