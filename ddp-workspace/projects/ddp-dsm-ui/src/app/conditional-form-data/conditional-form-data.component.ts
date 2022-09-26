import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldSettings} from '../field-settings/field-settings.model';

@Component({
  selector: 'app-conditional-form-data',
  templateUrl: './conditional-form-data.component.html',
  styleUrls: ['./conditional-form-data.component.css']
})
export class ConditionalFormDataComponent {
  @Input() fieldSetting: FieldSettings;
  @Input() participantData: any;
  @Input() activityData: string;
  @Input() activityOptions: string[];
  @Input() checkBoxGroups: {};
  @Input() patchFinished: boolean;
  @Output() patchDataConditionalField = new EventEmitter();

  currentPatchField: string;


  valueChanged(value: any): void {
    this.patchDataConditionalField.emit(value);
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

}
