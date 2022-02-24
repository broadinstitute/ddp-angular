export class FieldType {
  selected = false;

  constructor(public name: string, public tableAlias: string) {
    this.name = name;
    this.tableAlias = tableAlias;
  }
}
