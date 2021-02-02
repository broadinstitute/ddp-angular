import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {AddressEmbeddedComponent} from './addressEmbedded.component';
import {DdpAddressInputModule} from '../address-input/address-input.module';
import {DdpValidationMessageModule} from '../../validation-message/validation-message.module';

import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,

    MatCardModule,
    MatRadioModule,

    DdpAddressInputModule,
    DdpValidationMessageModule,
  ],
  declarations: [AddressEmbeddedComponent],
  exports: [AddressEmbeddedComponent],
})
export class DdpAddressEmbeddedModule { }
