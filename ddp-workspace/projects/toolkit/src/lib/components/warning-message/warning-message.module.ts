import { NgModule } from '@angular/core';
import { WarningMessageComponent } from './warning-message.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule
  ],
  declarations: [WarningMessageComponent],
  exports: [WarningMessageComponent]
})
export class WarningMessageModule {}
