import { NgModule } from '@angular/core';
import { CommonLandingComponent } from './common-landing.component';
import { CommonLandingRedesignedComponent } from './common-landing-redesigned.component';
import { HeaderModule } from '../header/header.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    HeaderModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  declarations: [
    CommonLandingComponent,
    CommonLandingRedesignedComponent
  ],
  exports: [
    CommonLandingComponent,
    CommonLandingRedesignedComponent
  ]
})
export class CommonLandingModule {}
