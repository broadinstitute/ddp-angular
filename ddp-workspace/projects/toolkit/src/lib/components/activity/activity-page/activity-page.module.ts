import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityPageComponent } from './activity-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../header/header.module';
import { DdpActivityModule } from '../../../../../../ddp-sdk/src/lib/components/activityForm/activity/activity.module';

const routes: Routes = [
  {
    path: '',
    component: ActivityPageComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderModule,
    DdpActivityModule
  ],
  declarations: [ActivityPageComponent],
})
export class ActivityPageModule { }
