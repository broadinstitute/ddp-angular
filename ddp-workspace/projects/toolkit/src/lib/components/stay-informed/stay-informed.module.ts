import { NgModule } from '@angular/core';
import { StayInformedComponent } from './stay-informed.component';
import { StayInformedRedesignedComponent } from './stay-informed-redesigned.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule,
    RouterModule,
  ],
  declarations: [
    StayInformedComponent,
    StayInformedRedesignedComponent
  ],
  exports: [
    StayInformedComponent,
    StayInformedRedesignedComponent
  ]
})
export class StayInformedModule {}
