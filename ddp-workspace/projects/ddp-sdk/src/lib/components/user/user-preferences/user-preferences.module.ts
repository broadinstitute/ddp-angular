import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { UserPreferencesComponent } from './userPreferences.component';
import { DdpValidationMessageModule } from '../../validation-message/validation-message.module';
import { DdpLoadingModule } from '../../behaviors/loading/loading.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,

    DdpValidationMessageModule,
    DdpLoadingModule,
  ],
  declarations: [UserPreferencesComponent],
  exports: [UserPreferencesComponent], // TODO should be private component
})
export class DdpUserPreferencesModule { }
