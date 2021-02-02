import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteTransformerDirective } from './routeTransformer.directive';



@NgModule({
  declarations: [RouteTransformerDirective],
  exports: [RouteTransformerDirective],
  imports: [
    CommonModule
  ]
})
export class RouteTransformerModule { }
