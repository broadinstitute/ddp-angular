import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { UserActivitiesComponent } from './userActivities.component';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    MatTableModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    UserActivitiesComponent
  ],
  exports: [
    UserActivitiesComponent
  ],
})
export class DdpUserActivitiesModule {}
