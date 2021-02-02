import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ActivityPageRedesignedComponent } from './activity-page-redesigned.component';
import { DdpActivityRedesignedModule } from '../../../../../../ddp-sdk/src/lib/components/activityForm/activity-redesigned/activity-redesigned.module';

const routes: Routes = [
  {
    path: '',
    component: ActivityPageRedesignedComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DdpActivityRedesignedModule
  ],
  declarations: [ActivityPageRedesignedComponent],
})
export class ActivityPageRedesignedModule { }
