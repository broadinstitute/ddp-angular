import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ActivityComponent} from './activity.component';
import {DdpLoaderModule} from '../../behaviors/loader/loader.module';
import {DdpActivitySectionModule} from '../activity-section/activity-section.module';

import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    MatButtonModule,

    DdpLoaderModule,
    DdpActivitySectionModule
  ],
  declarations: [ActivityComponent],
  exports: [ActivityComponent]
})
export class DdpActivityModule { }
