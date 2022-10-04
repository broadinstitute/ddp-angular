import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {FieldSettings} from '../field-settings/field-settings.model';
import {Value} from '../utils/value.model';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDataComponent implements OnInit, OnChanges {

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
  public showRadioOrNot = false;
  public checkedRadioBtnValue: string;
  currentPatchField: string;
  CONDITIONAL_DISPLAY = 'conditionalDisplay';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes, 'ng on changes')
  }


  get getCheckbox() {
    // console.log(this.conditionalData, 'CHECKBOX DATA')
    const foundData = this.conditionalData[0]?.[this.fieldSetting.actions[0]?.conditionalFieldSetting?.columnName];
    return foundData || "";
  }

  getRadio(type: string) {
    // console.log(type, 'RADIO TYPE')
    // console.log(this.conditionalData, 'RADIO DATA')
    const foundData = this.conditionalData?.find(data => data[type])?.[type];
    return foundData || "";
  }

  ngOnInit() {
    this.showConditional()
    this.showConditionalRadio()
    // console.log(this.participantData, '[INIT] participant data')
    // console.log(this.getOptions())
  }

  public isConditionalDisplay(): boolean {
    if (this.fieldSetting?.actions) {
      const [obj] = this.fieldSetting.actions;
      return obj.type === this.CONDITIONAL_DISPLAY;
    }
    return false;
  }

  public isConditionalDisplayRadio() {
    // console.log(this.fieldSetting, 'field setting')
    // console.log(this.fieldSetting?.actions, 'isConditionalDisplay')
    if (this.fieldSetting?.actions) {
      console.log(this.fieldSetting.actions.every(data => data.type === this.CONDITIONAL_DISPLAY), 'FIRST')
      return this.fieldSetting.actions.every(data => data.type === this.CONDITIONAL_DISPLAY);
    }
    return false;
  }

  public checkedRadioBtn: string

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
    // console.log(this.fieldSetting.possibleValues, 'POSSIBLE VALUES')
    // console.log(this.activityOptions, 'ACTIVITY OPTIONS')
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
    console.log(value, 'valueChanged')
    const v = this.createPatchValue(value);
    console.log(v, 'valueChanged emit')

    this.patchData.emit(v);
    this.showConditional();
    this.showConditionalRadio();
  }

  onRadioChange(radioBtn: MatRadioChange) {
    console.log(radioBtn, 'radio change')
    this.checkedRadioBtnValue = radioBtn.value;
    this.patchData.emit(radioBtn.value);
    this.showConditionalRadio();
  }

  conditionalValueChanged(value: any, key?): void {
    console.log(value, 'conditionalValueChanged')
    const v = this.createPatchValue(value);
    console.log(v, 'conditionalValueChanged emit')
    console.log(this.checkedRadioBtnValue, 'checkedRadioBtnValue')

    if(key) {
      this.patchDataConditionalField.emit({key: key, value: v, checkbox: true});
    } else {
      this.patchDataConditionalField.emit({key: this.checkedRadioBtnValue, value: v, checkbox: false});
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

  showConditionalRadio(): void {
    // console.log(this.participantData, 'participant data')
    const conditionalAction = this.fieldSetting.actions?.filter(action => action.conditionalFieldSetting);
    if (conditionalAction) {
      conditionalAction.forEach(data => {
        console.log(data.condition, String(this.participantData) , 'SECOND')
        if(data.condition === String(this.participantData)) {

          this.showRadioOrNot = true;
        }
      })
    }
  }

  public getConditionalFieldSettingRadio(value?: string): FieldSettings {
    // console.log(this.checkedRadioBtnValue, 'get conditional field setting radio')
    const conditionalAction = this.fieldSetting.actions.find(action => action.condition === (this.checkedRadioBtnValue || value));
    // console.log(conditionalAction.conditionalFieldSetting, 'THIRD')
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
