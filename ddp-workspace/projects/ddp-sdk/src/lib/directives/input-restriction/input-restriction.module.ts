import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRestrictionDirective } from './inputRestrictionDirective.directive';



@NgModule({
  declarations: [InputRestrictionDirective],
  exports: [InputRestrictionDirective], // TODO it was not exported before!
  imports: [
    CommonModule
  ]
})
export class InputRestrictionModule { }
