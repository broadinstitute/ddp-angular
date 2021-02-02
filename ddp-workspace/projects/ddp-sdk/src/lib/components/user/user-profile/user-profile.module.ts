import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './userProfile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [UserProfileComponent],
  exports: [UserProfileComponent],
})
export class DdpUserProfileModule { }
