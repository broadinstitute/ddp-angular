import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './userMenu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DdpLoginModule } from '../../login/login.module';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DdpLoginModule
  ],
  declarations: [UserMenuComponent],
  exports: [UserMenuComponent],
})
export class DdpUserMenuModule { }
