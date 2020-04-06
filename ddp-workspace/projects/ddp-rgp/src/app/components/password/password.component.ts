import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IrbPasswordService, NGXTranslateService } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private irbPassword: IrbPasswordService,
    private router: Router,
    private translate: NGXTranslateService) { }

  public ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  public clearErrorMessage(): void {
    this.errorMessage = '';
  }

  public checkPassword(): void {
    this.clearErrorMessage();
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
          this.setErrorMessage('PasswordPage.PasswordWrongError');
        }
      },
      error => {
        this.setErrorMessage('PasswordPage.OtherError');
      }
    );
  }

  private setErrorMessage(key: string): void {
    this.translate.getTranslation(key).pipe(
      take(1)
    ).subscribe((message: string) => {
      this.errorMessage = message;
    });
  }
}
