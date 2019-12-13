import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { ResendEmailServiceAgent, CompositeDisposable, Email } from 'ddp-sdk';

@Component({
    selector: 'toolkit-resend-email',
    template: `
    <div *ngIf="initialForm">
        <div class="Modal-title">
            <h1 mat-dialog-title class="Modal-title" translate>Toolkit.Dialogs.ResendEmail.InitialForm.Title</h1>
            <mat-icon (click)="closeDialog()" class="close">clear</mat-icon>
        </div>
        <mat-dialog-content>
            <p class="Modal-text" translate>Toolkit.Dialogs.ResendEmail.InitialForm.Text</p>
            <form [formGroup]="resendEmailForm">
                <mat-form-field class="ResendEmailField">
                    <input matInput
                        [(ngModel)]="email"
                        maxLength="200"
                        placeholder="{{'Toolkit.Dialogs.ResendEmail.InitialForm.EmailField.Placeholder' | translate}}"
                        formControlName="email">
                    <mat-error *ngIf="isValid('email')" translate>Toolkit.Dialogs.ResendEmail.InitialForm.EmailField.Error</mat-error>
                </mat-form-field>
                <div *ngIf="isLoadingError" class="ErrorMessage">
                    <span translate>Toolkit.Dialogs.ResendEmail.InitialForm.LoadingError</span>
                </div>
            </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end" class="row NoMargin">
            <button mat-button
                    color="primary"
                    class="ButtonFilled ButtonFilled--neutral ButtonFilled--neutral--margin Button--rect"
                    (click)="closeDialog()"
                    [innerHTML]="'Toolkit.Dialogs.ResendEmail.InitialForm.CancelButton' | translate">
            </button>
            <button mat-button
                    (click)="submitForm()"
                    color="primary"
                    class="ButtonFilled Button--rect"
                    [disabled]="sendButtonDisabled"
                    [innerHTML]="'Toolkit.Dialogs.ResendEmail.InitialForm.SubmitButton' | translate">
            </button>
        </mat-dialog-actions>
    </div>
    <div *ngIf="!initialForm">
        <div class="Modal-title">
            <h1 mat-dialog-title class="Modal-title" translate>Toolkit.Dialogs.ResendEmail.ThankYouForm.Title</h1>
            <mat-icon (click)="closeDialog()" class="close">clear</mat-icon>
        </div>
        <mat-dialog-content class="row topMarginMedium">
            <p class="Modal-text">
                <span translate>Toolkit.Dialogs.ResendEmail.ThankYouForm.Text</span>
                <span>{{ email }}.  </span>
                <span translate>Toolkit.Dialogs.ResendEmail.ThankYouForm.Text2</span>
                <span translate>{{infoEmail}}.</span>
            </p>
        </mat-dialog-content>
        <mat-dialog-actions align="end" class="row NoMargin">
            <button mat-button
                    color="primary"
                    class="ButtonFilled ButtonFilled--neutral Button--rect"
                    (click)="closeDialog()"
                    [innerHTML]="'Toolkit.Dialogs.ResendEmail.ThankYouForm.SubmitButton' | translate">
            </button>
        </mat-dialog-actions>
    </div>
    `
})
export class ResendEmailComponent implements OnInit, OnDestroy {
    public resendEmailForm: FormGroup;
    public initialForm = true;
    public email: string;
    public infoEmail: string;
    public isLoadingError = false;
    public sendButtonDisabled = false;
    private studyGuid: string;
    private anchor: CompositeDisposable;

    constructor(
        private resendEmail: ResendEmailServiceAgent,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ResendEmailComponent>,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        this.anchor = new CompositeDisposable();
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        this.infoEmail = this.toolkitConfiguration.infoEmail;
    }

    public ngOnInit(): void {
        this.initResendEmailForm();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }

    public submitForm(): void {
        this.isLoadingError = false;
        const controls = this.resendEmailForm.controls;
        if (this.resendEmailForm.invalid) {
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
            return;
        }
        this.sendButtonDisabled = true;
        const email: Email = this.createEmail;
        const add = this.resendEmail.addToResend(email, this.studyGuid).subscribe(
            x => {
                if (x) {
                    this.initialForm = false;
                } else {
                    this.isLoadingError = true;
                    this.sendButtonDisabled = false;
                }
            });
        this.anchor.addNew(add);
    }

    public isValid(controlName: string): boolean {
        const control = this.resendEmailForm.controls[controlName];
        return control.invalid && control.touched;
    }

    private get createEmail(): Email {
        return {
            email: this.resendEmailForm.value.email
        };
    }

    private initResendEmailForm(): void {
        this.resendEmailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
}
