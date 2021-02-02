import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionPromptComponent} from './questionPrompt.component';
import {DdpTooltipModule as DdpTooltipModule} from '../../tooltip/tooltip.module';


@NgModule({
  imports: [
    CommonModule,
    DdpTooltipModule,
  ],
  declarations: [QuestionPromptComponent],
  exports: [QuestionPromptComponent]
})
export class DdpQuestionPromptModule { }
