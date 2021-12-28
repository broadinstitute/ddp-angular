import { AbstractionField } from '../medical-record-abstraction/medical-record-abstraction-field.model';

export class AbstractionGroup {
  constructor(
    public abstractionGroupId: number,
    public displayName: string,
    public orderNumber: number,
    public fields: AbstractionField[]
  ) {
    this.abstractionGroupId = abstractionGroupId;
    this.displayName = displayName;
    this.orderNumber = orderNumber;
    this.fields = fields;
  }

  newAdded = false;
  deleted = false;
  changed = false;
  notUniqueError = false;

  static parse(json): AbstractionGroup {
    const abstractionFields: Array<AbstractionField> = [];
    const jsonData: any[] = json.fields;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const field = AbstractionField.parse(val);
        abstractionFields.push(field);
      });
    }
    return new AbstractionGroup(json.abstractionGroupId, json.displayName, json.orderNumber, abstractionFields);
  }

  static removeUnchangedSetting(array: Array<AbstractionGroup>): Array<AbstractionGroup> {
    const cleanedSettings: Array<AbstractionGroup> = [];
    for (const setting of array) {
      const fields = AbstractionField.removeUnchangedSetting(setting.fields);
      if (fields.length > 0) {
        setting.changed = true;
        setting.fields = fields;
      }
      if (setting.changed) {
        if (!(setting.newAdded && setting.deleted)) {
          cleanedSettings.push(setting);
        }
      }
    }
    return cleanedSettings;
  }

  getDisplayNameWithoutSpace(activity: string): string {
    return activity + '_' + this.displayName.replace(/\s/g, '');
  }

}

// eslint-disable-next-line max-classes-per-file
export class AbstractionWrapper {
  constructor(
    public abstraction: AbstractionGroup[],
    public review: AbstractionGroup[],
    public qc: AbstractionGroup[],
    public finalFields: AbstractionGroup[]
  ) {
    this.abstraction = abstraction;
    this.review = review;
    this.qc = qc;
    this.finalFields = finalFields;
  }

  static parse(json): AbstractionWrapper {
    return new AbstractionWrapper(json.abstraction, json.review, json.qc, json.finalFields);
  }
}
