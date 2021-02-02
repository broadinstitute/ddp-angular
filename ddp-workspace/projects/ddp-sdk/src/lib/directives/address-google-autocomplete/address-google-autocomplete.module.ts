import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressGoogleAutocompleteDirective } from './addressGoogleAutocomplete.directive';



@NgModule({
  declarations: [AddressGoogleAutocompleteDirective],
  exports: [AddressGoogleAutocompleteDirective], // TODO it was not exported before!
  imports: [
    CommonModule
  ]
})
export class AddressGoogleAutocompleteModule { }
