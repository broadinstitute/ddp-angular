import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivitySectionComponent} from './activitySection.component';
import {DdpActivityQuestionModule} from '../activity-question/activity-question.module';
import {DdpInstitutionsFormModule} from '../institutions/institutions-form/institutions-form.module';
import {DdpActivityContentModule} from '../activity-content/activity-content.module';
import {DdpBlockModule} from '../block/block.module';
import {DdpAddressEmbeddedModule} from '../../address/address-embedded/address-embedded.module';


@NgModule({
  imports: [
    CommonModule,
    DdpActivityQuestionModule,
    DdpActivityContentModule,
    DdpInstitutionsFormModule,
    DdpBlockModule,
    DdpAddressEmbeddedModule,
  ],
  declarations: [ActivitySectionComponent],
  exports: [ActivitySectionComponent],
})
export class DdpActivitySectionModule { }
