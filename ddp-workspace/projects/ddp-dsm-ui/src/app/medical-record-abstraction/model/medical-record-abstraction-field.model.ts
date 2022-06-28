import { Value } from '../../utils/value.model';
import { QCWrapper } from './qc-wrapper.model';
import { AbstractionFieldValue } from './abstraction-field-value.model';

export class AbstractionField {
  newAdded = false;
  deleted = false;
  changed = false;
  notUniqueError = false;
  viewHelpText = false;
  copiedActivity = '';

  constructor(public medicalRecordAbstractionFieldId: number, public displayName: string, public type: string,
              public helpText: string, public orderNumber: number,
              public possibleValues: Value[], public additionalType: string, public hide: boolean,
              public fieldValue: AbstractionFieldValue, public qcWrapper: QCWrapper, public fileInfo: boolean) {
  }

  static parse(json): AbstractionField {
    let fValue: AbstractionFieldValue = json.fieldValue;
    if (fValue == null) {
      fValue = new AbstractionFieldValue(null, null, '', 0, '', '', false, false, null, '', null);
    }
    let wrapper: QCWrapper = json.qcWrapper;
    if (wrapper == null) {
      const fieldValue: AbstractionFieldValue = new AbstractionFieldValue(null, null, '', 0, '', '', false, false, null, '', null);
      wrapper = new QCWrapper(fieldValue, fieldValue, false, false);
    }
    return new AbstractionField(
      json.medicalRecordAbstractionFieldId, json.displayName, json.type, json.helpText,
      json.orderNumber, json.possibleValues, json.additionalType, json.hide, fValue, wrapper, json.fileInfo
    );
  }

  static removeUnchangedSetting(array: Array<AbstractionField>): Array<AbstractionField> {
    const cleanedSettings: Array<AbstractionField> = [];
    for (const setting of array) {
      if (setting.changed) {
        if (!(setting.newAdded && setting.deleted)) {
          if (setting.possibleValues != null && setting.possibleValues.length > 0) {
            setting.possibleValues.forEach((item, index) => {
              if (item.value == null || item.value === '') {
                setting.possibleValues.splice(index, 1);
              } else if (item.values != null) {
                if (item.values.length > 0) {
                  const possibleValues = [];
                  item.values.forEach((value) => {
                    if (value.value != null && value.value !== '' && value.value.trim() !== '') {
                      possibleValues.push(value);
                    }
                  });
                  item.values = possibleValues;
                }
              }
            });
          }
          cleanedSettings.push(setting);
        }
      }
    }
    return cleanedSettings;
  }
}
