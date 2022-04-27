export class Value {
  newAdded = false;
  selected = true;

  constructor(
    public value?: string, public type?: string,
    public type2?: string, public name?: string, public values?: Value[]) {
  }

  static parse(json): Value {
    return new Value(json.value, json.type, json.type2, json.name, json.values);
  }
}
