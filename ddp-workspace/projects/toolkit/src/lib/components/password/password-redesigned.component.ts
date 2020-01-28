import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IrbPasswordService } from 'ddp-sdk';
import { PasswordComponent } from './password.component';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-password-redesigned',
    template: `
        <main class="main">
            <section class="section static-page-title-section">
                <div class="content content_tight">
                    <h1 translate>Toolkit.Password.Title</h1>
                </div>
            </section>
            <section class="section static-page-content-section">
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
                                <button [attr.aria-label]="'Common.Buttons.Submit.AriaLabel' | translate"
                                    class="button button_medium button_primary" translate>Common.Buttons.Submit.Title</button>
                            </div>
                            <div *ngIf="isPasswordWrong" class="ErrorMessage">
                                <span translate>Toolkit.Password.PasswordWrongError</span>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>`
})

export class PasswordRedesignedComponent extends PasswordComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        formBuilder: FormBuilder,
        irbPassword: IrbPasswordService,
        router: Router) {
        super(formBuilder, irbPassword, router);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupPasswordHeader();
    }
}
