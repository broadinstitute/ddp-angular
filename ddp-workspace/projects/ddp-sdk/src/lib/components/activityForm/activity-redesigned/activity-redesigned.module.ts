import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityRedesignedComponent} from './activity-redesigned.component';
import {DdpSubjectPanelModule} from '../../subject-panel/subject-panel.module';
import {DdpAdminActionPanelModule} from '../../admin-action-panel/admin-action-panel.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DdpActivitySectionModule} from '../activity-section/activity-section.module';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DdpSubjectPanelModule,
    DdpAdminActionPanelModule,
    DdpActivitySectionModule,
  ],
  declarations: [ActivityRedesignedComponent],
  exports: [ActivityRedesignedComponent],
})
export class DdpActivityRedesignedModule { }
