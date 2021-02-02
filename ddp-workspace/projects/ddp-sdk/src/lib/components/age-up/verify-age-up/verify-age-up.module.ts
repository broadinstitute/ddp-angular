import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VerifyAgeUpComponent} from './verifyAgeUp.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [VerifyAgeUpComponent],
  exports: [VerifyAgeUpComponent],
})
export class DdpVerifyAgeUpModule { }
