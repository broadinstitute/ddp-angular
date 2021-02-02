import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminActionPanelComponent} from './adminActionPanel.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    AdminActionPanelComponent,
  ],
  exports: [
    AdminActionPanelComponent,
  ],
})
export class DdpAdminActionPanelModule { }
