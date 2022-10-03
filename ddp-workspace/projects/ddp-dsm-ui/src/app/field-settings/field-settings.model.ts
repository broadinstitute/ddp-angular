import { Value } from '../utils/value.model';
import { FieldType } from './field-type.model';

export class FieldSettings {
  changed = false;
  deleted = false;
  changedBy: string;

  addedNew = false;

  notUniqueError = false;
  spaceError = false;

  constructor(public fieldSettingId: string, public columnName: string, public columnDisplay: string, public fieldType: string,
              public displayType: string, public possibleValues: Value[], public orderNumber: number, public actions: Value[],
              public readonly: boolean) {

  }

  static parse(json): FieldSettings {
    return new FieldSettings(json.fieldSettingId, json.columnName, json.columnDisplay, json.fieldType,
      json.displayType, json.hasOwnProperty('possibleValues') ? json.possibleValues : [], json.orderNumber,
      json.hasOwnProperty('actions') ? json.actions : [], json.readonly);
  }

  static addSettingWithType(map: Map<string, Array<FieldSettings>>, setting: FieldSettings, type: FieldType): void {
    if (map.has(type.name)) {
      map.get(type.name).push(setting);
    } else {
      const arr: Array<FieldSettings> = [];
      arr.push(setting);
      map.set(type.name, arr);
    }
  }

  static allowPossibleValues(setting: FieldSettings): boolean {
    return setting.displayType === 'OPTIONS' || setting.displayType === 'MULTI_OPTIONS';
  }

  static removeUnchangedFieldSettings(array: Array<FieldSettings>, selectedType: FieldType): Array<FieldSettings> {
    const cleanedFieldSettings: Array<FieldSettings> = [];
    for (const elem of array) {
      if (elem.changed && !(elem.addedNew && elem.deleted)) {
        if (elem.columnDisplay == null || elem.columnDisplay === '') {
          elem.columnDisplay = elem.columnName;
        }
        elem.fieldType = selectedType.tableAlias;
        if (elem.displayType === null || elem.displayType === '') {
          elem.displayType = 'TEXT';
        }
        const oldPVals: Array<Value> = elem.possibleValues;
        elem.possibleValues = [];
        if (this.allowPossibleValues(elem)) {
          // If possible values were specified and the display type is one that can have possible values, add valid possible values back
          if (oldPVals !== null && oldPVals !== undefined && oldPVals.length > 0) {
            oldPVals.forEach((item) => {
              if (item.value !== null && item.value !== undefined && item.value !== '' && item.value.trim() !== '') {
                elem.possibleValues.push(item);
              }
            });
          }
          // If the display type is select or multiselect but no options are specified, change it to text
          if (elem.possibleValues.length < 1) {
            elem.displayType = 'TEXT';
          }
        }
        cleanedFieldSettings.push(elem);
      }
    }
    return cleanedFieldSettings;
  }
}
