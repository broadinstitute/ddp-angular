import { NgModule } from '@angular/core';
import { InvitationPipe } from './invitationFormatter.pipe';

@NgModule({
  declarations: [InvitationPipe],
  exports: [InvitationPipe]
})
export class DdpInvitationFormatterModule {}
