import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalActivityData } from '../../models/modalActivityData';

@Component({
  selector: 'toolkit-new-modal-activity',
  template: `<toolkit-modal-activity [studyGuid]="data.studyGuid"
                                     [activityGuid]="data.instanceGuid"
                                     [data]="data"></toolkit-modal-activity>`
})
export class NewModalActivityComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalActivityData) {
  }
}
