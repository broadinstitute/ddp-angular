import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipComponent } from './tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
  ],
  declarations: [TooltipComponent],
  exports: [TooltipComponent],
})
export class DdpTooltipModule { }
