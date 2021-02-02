import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationCodeFormatterDirective } from './invitationCodeFormatter.directive';



@NgModule({
  declarations: [InvitationCodeFormatterDirective],
  exports: [InvitationCodeFormatterDirective],
  imports: [
    CommonModule
  ]
})
export class InvitationCodeFormatterModule { }
