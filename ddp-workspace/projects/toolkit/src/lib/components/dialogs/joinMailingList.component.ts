import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from './../../services/communication.service';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { MailingListServiceAgent, AnalyticsEventsService, CompositeDisposable, Person, AnalyticsEventCategories, AnalyticsEventActions } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
    selector: 'toolkit-join-mailing-list',
    template: `
    <div class="Modal-title">
        <h1 class="Modal-title no-margin" translate>Toolkit.Dialogs.JoinMailingList.Title</h1>
        <button mat-icon-button (click)="closeDialog()">
            <mat-icon class="ddp-close-button">clear</mat-icon>
        </button>
    </div>
    <mat-dialog-content>
        <p class="Modal-text" [innerHTML]="'Toolkit.Dialogs.JoinMailingList.Text' | translate"></p>
        <form [formGroup]="joinForm">
            <div class="JoinDialogGroupFields">
                <mat-form-field class="JoinDialogNameField JoinField--margin">
                    <input matInput
                           maxLength="200"
                           placeholder="{{'Toolkit.Dialogs.JoinMailingList.Fields.FirstName.Placeholder' | translate}}"
                           formControlName="firstName">
                    <mat-error *ngIf="isValid('firstName')" translate>Toolkit.Dialogs.JoinMailingList.Fields.FirstName.Error</mat-error>
                </mat-form-field>
                <mat-form-field class="JoinDialogLastnameField JoinField--margin">
                    <input matInput
                           maxLength="200"
                           placeholder="{{'Toolkit.Dialogs.JoinMailingList.Fields.LastName.Placeholder' | translate}}"
                           formControlName="lastName">
                    <mat-error *ngIf="isValid('lastName')" translate>Toolkit.Dialogs.JoinMailingList.Fields.LastName.Error</mat-error>
                </mat-form-field>
            </div>
            <mat-form-field class="JoinDialogFiled JoinField--margin">
                <input matInput
                       maxLength="200"
                       placeholder="{{'Toolkit.Dialogs.JoinMailingList.Fields.Email.Placeholder' | translate}}"
                       formControlName="email">
                <mat-error *ngIf="isValid('email')" translate>Toolkit.Dialogs.JoinMailingList.Fields.Email.Error</mat-error>
            </mat-form-field>
            <mat-form-field class="JoinDialogFiled JoinField--margin">
                <input matInput
                       maxLength="200"
                       placeholder="{{'Toolkit.Dialogs.JoinMailingList.Fields.ConfirmEmail.Placeholder' | translate}}"
                       formControlName="confirmEmail">
                <mat-error *ngIf="isValid('confirmEmail')" translate>Toolkit.Dialogs.JoinMailingList.Fields.ConfirmEmail.Error</mat-error>
            </mat-form-field>
            <div class="Italic Color--neutral" translate>Toolkit.Dialogs.JoinMailingList.Required</div>
            <div *ngIf="isEmailsDifferent" class="ErrorMessage">
                <span translate>Toolkit.Dialogs.JoinMailingList.MatchEmailsError</span>
            </div>
            <div *ngIf="isLoadingError" class="ErrorMessage">
                <span translate>Toolkit.Dialogs.JoinMailingList.LoadingError</span>
            </div>
        </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="row NoMargin">
        <button (click)="closeDialog()"
                class="ButtonFilled ButtonFilled--neutral ButtonFilled--neutral--margin Button--rect button button_small button_secondary"
                [innerHTML]="'Toolkit.Dialogs.JoinMailingList.CancelButton' | translate">
        </button>
        <button (click)="submitForm()"
                [disabled]="joinButtonDisabled"
                class="ButtonFilled Button--rect button button_small button_primary"
                [innerHTML]="'Toolkit.Dialogs.JoinMailingList.SubmitButton' | translate">
        </button>
    </mat-dialog-actions>`
})
export class JoinMailingListComponent implements OnInit, OnDestroy {
    public joinForm: FormGroup;
    public isEmailsDifferent = false;
    public isLoadingError = false;
    public joinButtonDisabled = false;
    private studyGuid: string;
    private stayInformedUrl: string;
    private anchor: CompositeDisposable;

    constructor(
        private dialogRef: MatDialogRef<JoinMailingListComponent>,
        private communicationService: CommunicationService,
        private router: Router,
        private formBuilder: FormBuilder,
        private mailingService: MailingListServiceAgent,
        private analytics: AnalyticsEventsService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initJoinForm();
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        this.stayInformedUrl = this.toolkitConfiguration.stayInformedUrl;
        this.anchor = new CompositeDisposable();
        this.dialogRef.afterClosed().pipe(
            take(1)
        ).subscribe((isSubmitted) => {
            if (isSubmitted) {
                this.communicationService.closeSidePanel();
                this.router.navigateByUrl(this.stayInformedUrl);
            }
        });
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public closeDialog(isSubmitted = false): void {
        this.dialogRef.close(isSubmitted);
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
            firstName: [this.data.firstName ? this.data.firstName : '', Validators.required],
            lastName: [this.data.lastName ? this.data.lastName : '', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            confirmEmail: ['', [Validators.required, Validators.email]]
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
