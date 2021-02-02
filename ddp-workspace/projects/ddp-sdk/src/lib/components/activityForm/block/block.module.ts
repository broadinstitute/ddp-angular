import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConditionalBlockComponent} from './conditionalBlock.component';
import {GroupBlock} from './groupBlock.component';
import {GroupBlockList} from './groupBlockList.component';
import {DdpActivityQuestionModule} from '../activity-question/activity-question.module';


@NgModule({
  imports: [
    CommonModule,
    DdpActivityQuestionModule,
  ],
  declarations: [
    ConditionalBlockComponent,
    GroupBlock,
    GroupBlockList,
  ],
  exports: [
    ConditionalBlockComponent,
    GroupBlock,
    GroupBlockList,
  ],
})
export class DdpBlockModule { }
