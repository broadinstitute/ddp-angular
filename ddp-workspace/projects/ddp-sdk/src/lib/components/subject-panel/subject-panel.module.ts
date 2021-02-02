import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectPanelComponent } from './subjectPanel.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DdpInvitationFormatterModule } from '../../pipes/invitationFormatter.module';


@NgModule({
  declarations: [SubjectPanelComponent],
  exports: [SubjectPanelComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    DdpInvitationFormatterModule
  ]
})
export class DdpSubjectPanelModule { }
