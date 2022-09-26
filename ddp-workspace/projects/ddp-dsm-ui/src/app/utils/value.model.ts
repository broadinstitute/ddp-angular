import {FieldSettings} from '../field-settings/field-settings.model';

export class Value {
  newAdded = false;
  selected = true;

  constructor(
    public value?: string, public type?: string,
    public type2?: string, public name?: string, public values?: Value[], public conditionalFieldSetting?: FieldSettings) {
  }

  static parse(json): Value {
    let conditionalFieldSetting: FieldSettings  = null;
    if (json.conditionalFieldSetting) {
       conditionalFieldSetting = FieldSettings.parse( json.conditionalFieldSetting );
    }
    return new Value(json.value, json.type, json.type2, json.name, json.values, conditionalFieldSetting);
  }
}
