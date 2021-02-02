import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadResourcesDirective } from './lazyLoadResources.directive';



@NgModule({
  declarations: [LazyLoadResourcesDirective],
  exports: [LazyLoadResourcesDirective],
  imports: [
    CommonModule
  ]
})
export class LazyLoadModule { }
