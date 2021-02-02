import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupWithCheckboxComponent} from './popupWithCheckbox.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  declarations: [PopupWithCheckboxComponent],
  exports: [PopupWithCheckboxComponent],
})
export class DdpPopupWithCheckboxModule { }
