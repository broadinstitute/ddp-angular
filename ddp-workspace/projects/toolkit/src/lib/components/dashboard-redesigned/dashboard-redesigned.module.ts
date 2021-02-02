import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRedesignedComponent } from './dashboard-redesigned.component';
import { RouterModule, Routes } from '@angular/router';
import { DdpSubjectPanelModule } from '../../../../../ddp-sdk/src/lib/components/subject-panel/subject-panel.module';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DdpUserActivitiesModule} from "../../../../../ddp-sdk/src/lib/components/user/activities/user-activities.module";
import {DdpInvitationFormatterModule} from "../../../../../ddp-sdk/src/lib/pipes/invitationFormatter.module";

const routes: Routes = [
  {
    path: '',
    component: DashboardRedesignedComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    DdpSubjectPanelModule,
    DdpUserActivitiesModule,
    DdpInvitationFormatterModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [DashboardRedesignedComponent],
})
export class DashboardRedesignedModule { }
