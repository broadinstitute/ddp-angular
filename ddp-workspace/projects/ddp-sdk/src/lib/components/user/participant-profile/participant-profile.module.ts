import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ParticipantProfileComponent } from './participantProfile.component';
import { ManageParticipantsComponent } from './manageParticipants.component';
import { DdpLoadingModule } from '../../behaviors/loading/loading.module';
import { DdpUserPreferencesModule } from '../user-preferences/user-preferences.module';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,

    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,

    DdpLoadingModule,
    DdpUserPreferencesModule,
  ],
  declarations: [
    ParticipantProfileComponent,
    ManageParticipantsComponent,
  ],
  exports: [ParticipantProfileComponent],
})
export class DdpParticipantProfileModule { }
