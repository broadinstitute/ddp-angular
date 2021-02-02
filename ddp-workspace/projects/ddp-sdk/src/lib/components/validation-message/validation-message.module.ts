import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessage } from './validationMessage.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouteTransformerModule } from '../../directives/route-transformer/route-transformer.module';



@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouteTransformerModule,
  ],
  declarations: [ValidationMessage],
  exports: [ValidationMessage],
})
export class DdpValidationMessageModule { }
