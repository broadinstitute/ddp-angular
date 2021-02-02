import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {AddressInputComponent} from './addressInput.component';
import {UppercaseModule} from '../../../directives/uppercase/uppercase.module';
import {AddressGoogleAutocompleteModule} from '../../../directives/address-google-autocomplete/address-google-autocomplete.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,

    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,

    // DdpModule,
    UppercaseModule,
    AddressGoogleAutocompleteModule,
  ],
  declarations: [
    AddressInputComponent,
  ],
  exports: [
    AddressInputComponent,
  ],
})
export class DdpAddressInputModule { }
