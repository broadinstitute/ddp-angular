import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IrbPasswordService } from 'ddp-sdk';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-password',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

    <ng-template #newDesign>
        <main class="main">
            <section class="section static-page-title-section">
                <div class="content content_tight">
                    <h1 translate>Toolkit.Password.Title</h1>
                </div>
            </section>
            <section class="section">
                <div class="content content_tight">
                    <div class="password-section">
                        <p class="password-section__question" translate>Toolkit.Password.Text</p>
                        <form [formGroup]="passwordForm" (ngSubmit)="submitForm()">
                            <mat-form-field>
                                <input matInput
                                    type="password"
                                    formControlName="password"
                                    [placeholder]="'Toolkit.Password.InputPlaceholder' | translate"
                                    maxLength="200">
                                    <mat-error *ngIf="isValid('password')" translate>Toolkit.Password.PasswordRequiredError</mat-error>
                            </mat-form-field>
                            <div class="password-section__button">
                                <button class="button button_medium button_primary" translate>
                                    Common.Buttons.Submit
                                </button>
                            </div>
                            <div *ngIf="isPasswordWrong" class="ErrorMessage">
                                <span translate>Toolkit.Password.PasswordWrongError</span>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </ng-template>

    <ng-template #oldDesign>
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
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </ng-template>`
})

export class PasswordComponent implements OnInit {
    public passwordForm: FormGroup;
    public isPasswordWrong = false;
    public useRedesign: boolean;

    constructor(
        private headerConfig: HeaderConfigurationService,
        private formBuilder: FormBuilder,
        private irbPassword: IrbPasswordService,
        private router: Router,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initPasswordForm();
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupPasswordHeader();
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
