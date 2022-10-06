import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {FieldSettings} from '../field-settings/field-settings.model';
import {Value} from '../utils/value.model';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css'],
})
export class FormDataComponent implements OnInit {

  @Input() fieldSetting: FieldSettings;
  @Input() participantData: any;
  @Input() conditionalData: any;
  @Input() activityData: string;
  @Input() activityOptions: string[];
  @Input() checkBoxGroups: {};
  @Input() patchFinished: boolean;
  @Output() patchData = new EventEmitter();
  @Output() patchDataConditionalField = new EventEmitter();


  public showOrNot = false;
  public checkedRadioBtnValue: string;
  public checkedRadioBtn: string
  currentPatchField: string;
  CONDITIONAL_DISPLAY = 'conditionalDisplay';

  constructor() {}


  get getCheckbox(): string {
    const foundData = this.conditionalData[0]?.[this.fieldSetting.actions[0]?.conditionalFieldSetting?.columnName];
    return foundData || "";
  }

  getRadio(type: string): string {
    const foundData = this.conditionalData?.find(data => data[type])?.[type];
    return foundData || "";
  }

  ngOnInit(): void {
    this.showConditional();
  }

  public isConditionalDisplay(): boolean {
    if (this.fieldSetting?.actions) {
      const [obj] = this.fieldSetting.actions;
      return obj.type === this.CONDITIONAL_DISPLAY;
    }
    return false;
  }

  public isConditionalDisplayRadio() {
    if (this.fieldSetting?.actions) {
      return this.fieldSetting.actions.every(data => data.type === this.CONDITIONAL_DISPLAY);
    }
    return false;
  }

  getActivityAnswer(): string {

    if (this.fieldSetting.displayType !== 'ACTIVITY')  {
      // get data from dsm db if it is not type activity
      if (this.fieldSetting.displayType !== 'ACTIVITY_STAFF') {
        // return savedAnswer if it is not type activity_staff
        this.checkedRadioBtn = this.participantData.toString();
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

  showConditional(): void {
    const conditionalAction = this.fieldSetting.actions?.find(action => action.conditionalFieldSetting);
    if (conditionalAction) {
      this.showOrNot = String(this.participantData) === conditionalAction.condition;
    }
  }

  getOptions(): Value[] | string[] {
    if (this.fieldSetting.displayType !== 'ACTIVITY' && this.fieldSetting.displayType !== 'ACTIVITY_STAFF') {
      return this.fieldSetting.possibleValues;
    } else {
      return this.activityOptions;
    }
  }

  clearRadioSelection(): void {
    this.valueChanged('');
  }

  valueChanged(value: any): void {
    const v = this.createPatchValue(value);

    this.patchData.emit(v);
    this.showConditional();
  }

  onRadioChange(radioBtn: MatRadioChange) {
    this.checkedRadioBtnValue = radioBtn.value;
    this.patchData.emit(radioBtn.value);
  }

  conditionalValueChanged(htmlTextAreaElement: EventTarget, key?): void {
    let v;
    if(key) {
      v = (htmlTextAreaElement as any).target.value;
      this.patchDataConditionalField.emit({key: key, value: v, checkbox: true});
    } else {
      v = (htmlTextAreaElement as HTMLTextAreaElement).value;
      this.patchDataConditionalField.emit({key: this.checkedRadioBtnValue || this.getActivityAnswer(), value: v, checkbox: false});
    }
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

  public getConditionalFieldSetting(): FieldSettings {
    const conditionalAction = this.fieldSetting.actions.find(action => action.conditionalFieldSetting);
    if (conditionalAction) {
      return conditionalAction.conditionalFieldSetting;
    }
    return null;
  }

  showConditionalRadio(): boolean {
    const conditionalAction = this.fieldSetting.actions?.filter(action => action.conditionalFieldSetting);
    return !!conditionalAction?.some(data => data.condition === String(this.participantData))
  }

  public getConditionalFieldSettingRadio(value?: string): FieldSettings {
    let conditionalAction;
    if(value) {
      conditionalAction = this.fieldSetting.actions.find(action => action.conditionalFieldSetting.columnName === value);
    } else {
      conditionalAction = this.fieldSetting.actions.find(action => action.condition === this.checkedRadioBtnValue);
    }

    if (conditionalAction) {
      return conditionalAction.conditionalFieldSetting;
    }
    return null;
  }

  createPatchValue(value: any): any {
    this.patchFinished = false;
    let v;
    if (typeof value === 'string') {
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        if(this.isConditionalDisplay())  {
          v = value.srcElement.value || false;
        } else {
          v = value.srcElement.value;
        }

      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (value.source.value != null && value.source.selected) {
        v = value.source.value;
      }
    }
    this.participantData = v;
    return v;
  }

}
