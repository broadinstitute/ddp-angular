import { NgModule } from '@angular/core';
import { InternationalPatientsComponent } from './internationalPatients.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule
  ],
  declarations: [
    InternationalPatientsComponent
  ],
  exports: [
    InternationalPatientsComponent
  ]
})
export class InternationalPatientsModule {}
