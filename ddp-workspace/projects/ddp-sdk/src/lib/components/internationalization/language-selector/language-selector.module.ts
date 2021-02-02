import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageSelectorComponent} from './languageSelector.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {DdpPopupWithCheckboxModule} from '../../popup-with-checkbox/popup-with-checkbox.module';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    DdpPopupWithCheckboxModule,
  ],
  declarations: [LanguageSelectorComponent],
  exports: [LanguageSelectorComponent],
})
export class DdpLanguageSelectorModule { }
