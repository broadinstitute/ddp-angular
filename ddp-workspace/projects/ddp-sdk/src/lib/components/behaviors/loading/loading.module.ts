import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from './loading.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
  ],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class DdpLoadingModule { }
