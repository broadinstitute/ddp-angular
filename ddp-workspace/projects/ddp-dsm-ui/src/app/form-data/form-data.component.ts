import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldSettings } from '../field-settings/field-settings.model';
import { Value } from '../utils/value.model';

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css']
})
export class FormDataComponent {

  @Input() fieldSetting: FieldSettings;
  @Input() participantData: string;
  @Input() activityData: string;
  @Input() activityOptions: string[];
  @Input() checkBoxGroups: {};
  @Input() patchFinished: boolean;
  @Output() patchData = new EventEmitter();

  currentPatchField: string;

  getActivityAnswer(): string {
    if (this.fieldSetting.displayType !== 'ACTIVITY')  {
      // get data from dsm db if it is not type activity
      if (this.fieldSetting.displayType !== 'ACTIVITY_STAFF') {
        // return savedAnswer if it is not type activity_staff
        return this.participantData ? this.participantData.toString() : this.participantData;
      } else {
        // if it is type activity_staff only return if it is not empty, otherwise return answer from the activity
        if (this.participantData != null && this.participantData !== '') {
          return this.participantData ? this.participantData.toString() : this.participantData;
        }
      }
    }
    return this.activityData ? this.activityData.toString() : this.activityData;
  }

  isChecked(): boolean {
    if (this.participantData === 'true' || this.participantData) {
      return true;
    }
    return false;
  }

  getOptions(): Value[] | string[] {
    if (this.fieldSetting.displayType !== 'ACTIVITY' && this.fieldSetting.displayType !== 'ACTIVITY_STAFF') {
      return this.fieldSetting.possibleValues;
    } else {
      return this.activityOptions;
    }
  }

  valueChanged(value: any): void {
    this.patchFinished = false;
    let v;
    if (typeof value === 'string') {
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (value.source.value != null && value.source.selected) {
        v = value.source.value;
      }
    }
    this.participantData = v;
    this.patchData.emit(v);
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  isCheckboxPatchedCurrently(field: string): string {
    if (this.currentPatchField === field) {
      return 'warn';
    }
    return 'primary';
  }
}
