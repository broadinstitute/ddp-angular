import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { DdpUserMenuModule } from '../../../../../ddp-sdk/src/lib/components/user/user-menu/user-menu.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatToolbarModule,
    DdpUserMenuModule,
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule {
}
