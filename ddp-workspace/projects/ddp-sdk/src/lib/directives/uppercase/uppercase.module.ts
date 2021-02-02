import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperCaseInputDirective } from './upperCaseInputDirective.directive';



@NgModule({
  declarations: [UpperCaseInputDirective],
  exports: [UpperCaseInputDirective],
  imports: [
    CommonModule
  ]
})
export class UppercaseModule { }
