import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldSettings} from '../field-settings/field-settings.model';

@Component({
  selector: 'app-conditional-form-data',
  templateUrl: './conditional-form-data.component.html',
  styleUrls: ['./conditional-form-data.component.css']
})
export class ConditionalFormDataComponent implements OnInit{
  @Input() fieldSetting: FieldSettings;
  @Input() participantData: any;
  @Input() activityData: string;
  @Input() activityOptions: string[];
  @Input() checkBoxGroups: {};
  @Input() patchFinished: boolean;
  @Output() patchDataConditionalField = new EventEmitter();
  TEXT_AREA_DEFAULT_SIZE = 50000;
  TEXT_DEFAULT_SIZE = 200;
  dynamicMaxLength = 100;

  currentPatchField: string;

  ngOnInit(): void {
    if (this.fieldSetting.details && this.fieldSetting.details['size'] > 0) {
      this.dynamicMaxLength = this.fieldSetting.details['size'];
    } else if (this.fieldSetting.displayType === 'TEXT') {
      this.dynamicMaxLength = this.TEXT_DEFAULT_SIZE;
    } else {
      this.dynamicMaxLength = this.TEXT_AREA_DEFAULT_SIZE;
    }
  }


  valueChanged(value: any): void {
    this.patchDataConditionalField.emit(value);
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  getTextAreaRows(fieldSettings: FieldSettings): number {
    if (fieldSettings.details && fieldSettings.details['size'] > 0) {
      return fieldSettings.details['size']/100;
    }
    return 10;
  }

}
