import {ValueModel} from './value.model';

export interface FieldSettingsModel {
  fieldSettingId: string;
  columnName: string;
  columnDisplay: string;
  fieldType: string;
  displayType: string;
  possibleValues: ValueModel[];
  orderNumber: number;
  actions: ValueModel[];
  readonly: boolean;
}
