import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IrbPasswordService } from 'ddp-sdk';

@Component({
    selector: 'toolkit-password',
    template: `
        <toolkit-header [showButtons]="true"
                        [showUserMenu]="false">
        </toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" translate>
                                Toolkit.Password.Title
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <article class="PageContent">
                <div class="PageLayout">
                    <div class="row NoMargin">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <section class="PageContent-section">
                                <h1 class="PageContent-title" translate>Toolkit.Password.Text</h1>
                                <form [formGroup]="passwordForm" (ngSubmit)="submitForm()">
                                    <mat-form-field>
                                        <input matInput
                                            type="password"
                                            (change)="hideErrors()"
                                            formControlName="password"
                                            maxLength="200">
                                            <mat-error *ngIf="isValid('password')" translate>Toolkit.Password.PasswordField.Error</mat-error>
                                    </mat-form-field>
                                    <button class="ButtonFilled"
                                            type="submit"
                                            [innerHTML]="'Toolkit.Password.SubmitButton' | translate">
                                    </button>
                                    <div *ngIf="isPasswordWrong" class="ErrorMessage">
                                        <span translate>Toolkit.Password.PasswordWrongError</span>
                                    </div>
                                    <div *ngIf="isOtherError" class="ErrorMessage">
                                        <span translate>Toolkit.Password.OtherError</span>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>`
})

export class PasswordComponent implements OnInit {
    public passwordForm: FormGroup;
    public isPasswordWrong = false;
    public isOtherError = false;

    constructor(
        private formBuilder: FormBuilder,
        private irbPassword: IrbPasswordService,
        private router: Router) { }

    public ngOnInit(): void {
        this.initPasswordForm();
    }

    public submitForm(): void {
        this.hideErrors();
        const password = this.passwordForm.controls['password'].value;
        const controls = this.passwordForm.controls;
        if (this.passwordForm.invalid) {
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

            return;
        }
        this.irbPassword.checkPassword(password).subscribe(
            response => {
                if (response) {
                    this.router.navigateByUrl('');
                } else {
                    this.isPasswordWrong = true;
                }
            },
            error => {
                this.isOtherError = true;
            }
        );
    }

    public hideErrors(): void {
        this.isPasswordWrong = false;
        this.isOtherError = false;
    }

    public isValid(controlName: string): boolean {
        const control = this.passwordForm.controls[controlName];

        return control.invalid && control.touched;
    }

    private initPasswordForm(): void {
        this.passwordForm = this.formBuilder.group({
            password: ['', Validators.required]
        });
    }
}
