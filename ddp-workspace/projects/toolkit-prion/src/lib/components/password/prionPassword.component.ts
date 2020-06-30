import { Component, OnInit } from "@angular/core";
import { PasswordComponent } from "toolkit";
import { FormBuilder } from "@angular/forms";
import { IrbPasswordService } from "ddp-sdk";
import { Router } from "@angular/router";

@Component({
  selector: 'prion-password',
  template: `<prion-header></prion-header>
  <div class="Container row">
    <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
      <h1 class="PageContent-title" translate>Toolkit.Password.Title</h1>
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
    </div>
  </div>
  `
})
export class PrionPasswordComponent extends PasswordComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _irbPassword: IrbPasswordService,
    private _router: Router) {
    super(_formBuilder, _irbPassword, _router);
  }
}
