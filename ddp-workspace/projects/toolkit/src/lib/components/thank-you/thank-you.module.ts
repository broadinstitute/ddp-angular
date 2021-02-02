import { NgModule } from '@angular/core';
import { AgeUpThankYou } from './age-up-thank-you.component';
import { LovedOneThankYouComponent } from './loved-one-thank-you.component';
import { LovedOneThankYouRedesignedComponent } from './loved-one-thank-you-redesigned.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule,
    CommonModule,
    RouterModule
  ],
  declarations: [
    AgeUpThankYou,
    LovedOneThankYouComponent,
    LovedOneThankYouRedesignedComponent,
  ],
  exports: [
    AgeUpThankYou,
    LovedOneThankYouComponent,
    LovedOneThankYouRedesignedComponent,
  ]
})
export class ThankYouModule {}
