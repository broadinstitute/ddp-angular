import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {DdpUserActivitiesModule} from '../user/activities/user-activities.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DdpUserActivitiesModule,
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DdpDashboardModule { }
