import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ActivityComponent } from './activity.component';
import { ActivityLinkComponent } from './activity-link.component';
import { ActivityRedesignedComponent } from './activity-redesigned.component';
import { ModalActivityComponent } from './modal-activity.component';
import { ModalActivityButtonComponent } from './modal-activity-button.component';
import { WorkflowStartActivityComponent } from './workflow-start-activity.component';
import { WorkflowStartActivityRedesignedComponent } from './workflow-start-activity-redesigned.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { HeaderModule } from '../header/header.module';
import { DdpActivityModule } from '../../../../../ddp-sdk/src/lib/components/activityForm/activity/activity.module';
import { DdpActivityRedesignedModule } from '../../../../../ddp-sdk/src/lib/components/activityForm/activity-redesigned/activity-redesigned.module';
import { DdpActivitySectionModule } from '../../../../../ddp-sdk/src/lib/components/activityForm/activity-section/activity-section.module';

@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    DdpActivityModule,
    DdpActivityRedesignedModule,
    DdpActivitySectionModule
  ],
  declarations: [
    ActivityComponent,
    ActivityRedesignedComponent,
    ActivityLinkComponent,
    ModalActivityComponent,
    ModalActivityButtonComponent,
    WorkflowStartActivityComponent,
    WorkflowStartActivityRedesignedComponent,
  ],
  exports: [
    ActivityComponent,
    ActivityRedesignedComponent,
    ActivityLinkComponent,
    ModalActivityComponent,
    ModalActivityButtonComponent,
    WorkflowStartActivityComponent,
    WorkflowStartActivityRedesignedComponent,
  ]
})
export class ActivityModule {}
