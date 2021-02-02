import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InstitutionComponent} from './institution.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DdpValidationMessageModule} from '../../../validation-message/validation-message.module';


``
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    DdpValidationMessageModule,
  ],
  declarations: [InstitutionComponent],
  exports: [InstitutionComponent],
})
export class DdpInstitutionModule {}
