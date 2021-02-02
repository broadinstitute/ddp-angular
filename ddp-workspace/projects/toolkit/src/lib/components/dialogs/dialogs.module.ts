import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DisclaimerComponent } from './disclaimer.component';
import { JoinMailingListComponent } from './joinMailingList.component';
import { ResendEmailComponent } from './resendEmail.component';
import { SessionWillExpireComponent } from './sessionWillExpire.component';
import { WarningComponent } from './warning.component';
import { WarningMessageModule } from '../warning-message/warning-message.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    WarningMessageModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    DisclaimerComponent,
    JoinMailingListComponent,
    ResendEmailComponent,
    SessionWillExpireComponent,
    WarningComponent,
  ],
  exports: [
    DisclaimerComponent,
    JoinMailingListComponent,
    ResendEmailComponent,
    SessionWillExpireComponent,
    WarningComponent,
  ]
})
export class DialogsModule {}
