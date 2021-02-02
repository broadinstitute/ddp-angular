import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { ErrorRedesignedComponent } from './error-redesigned.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [
    ErrorComponent,
    ErrorRedesignedComponent
  ],
  exports: [
    ErrorComponent,
    ErrorRedesignedComponent
  ]
})
export class ErrorModule {}

