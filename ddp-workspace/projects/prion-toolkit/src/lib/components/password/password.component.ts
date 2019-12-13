import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IrbPasswordService } from 'ddp-sdk';

@Component({
    selector: 'toolkit-password',
    template: `
    <toolkit-header>
    </toolkit-header>
    <div class="Container row">
        <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
            <h1 class="PageContent-title">Please enter your password:</h1>
            <form [formGroup]="passwordForm" (ngSubmit)="submitForm()">
                <mat-form-field>
                    <input matInput type="password" formControlName="password" maxLength="200">
                        <mat-error *ngIf="isValid('password')" translate>Toolkit.Password.PasswordField.Error</mat-error>
                </mat-form-field>
                <button class="ButtonFilled" type="submit" [innerHTML]="'Toolkit.Password.SubmitButton' | translate">
                </button>
                <div *ngIf="isPasswordWrong" class="ErrorMessage">
                    <span translate>Toolkit.Password.PasswordWrongError</span>
                </div>
            </form>   
        </div>
    </div>
    `
})

export class PasswordComponent implements OnInit {
    public passwordForm: FormGroup;
    public isPasswordWrong = false;

    constructor(
        private formBuilder: FormBuilder,
        private irbPassword: IrbPasswordService,
        private router: Router) { }

    public ngOnInit(): void {
        this.initPasswordForm();
    }

    public submitForm(): void {
        this.isPasswordWrong = false;
        const password = this.passwordForm.controls['password'].value;
        const controls = this.passwordForm.controls;
        if (this.passwordForm.invalid) {
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());

            return;
        }
        this.irbPassword.checkPassword(password).subscribe(
            x => {
                if (x) {
                    this.router.navigateByUrl('');
                } else {
                    this.isPasswordWrong = true;
                }
            }
        );
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
