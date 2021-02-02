import { NgModule } from '@angular/core';
import { SessionExpiredComponent } from './session-expired.component';
import { SessionExpiredRedesignedComponent } from './session-expired-redesigned.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    HeaderModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [
    SessionExpiredComponent,
    SessionExpiredRedesignedComponent
  ],
  exports: [
    SessionExpiredComponent,
    SessionExpiredRedesignedComponent
  ]
})
export class SessionExpiredModule {}
