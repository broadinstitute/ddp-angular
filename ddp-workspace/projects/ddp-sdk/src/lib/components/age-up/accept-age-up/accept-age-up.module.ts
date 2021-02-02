import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AcceptAgeUpComponent} from './acceptAgeUp.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [AcceptAgeUpComponent],
  exports: [AcceptAgeUpComponent],
})
export class DdpAcceptAgeUpModule { }
