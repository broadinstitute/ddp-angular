import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityContentComponent} from './activityContent.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ActivityContentComponent],
  exports: [ActivityContentComponent],
})
export class DdpActivityContentModule { }
