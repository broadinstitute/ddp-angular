import { NgModule } from '@angular/core';
import { PasswordRedesignedComponent } from './password-redesigned.component';
import { PasswordComponent } from './password.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    PasswordComponent,
    PasswordRedesignedComponent
  ],
  exports: [
    PasswordComponent,
    PasswordRedesignedComponent
  ]
})
export class PasswordModule {}
