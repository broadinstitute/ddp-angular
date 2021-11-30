export class LabelSetting {
  addedNew = false;
  changed = false;
  deleted = false;
  notUniqueError = false;

  constructor(public labelSettingId: string, public name: string, public description: string, public defaultPage: boolean,
              public labelOnPage: number, public labelHeight: number, public labelWidth: number, public topMargin: number,
              public rightMargin: number, public bottomMargin: number, public leftMargin: number) {
    this.labelSettingId = labelSettingId;
    this.name = name;
    this.description = description;
    this.defaultPage = defaultPage;
    this.labelOnPage = labelOnPage;
    this.labelHeight = labelHeight;
    this.labelWidth = labelWidth;
    this.topMargin = topMargin;
    this.rightMargin = rightMargin;
    this.bottomMargin = bottomMargin;
    this.leftMargin = leftMargin;
  }

  static parse(json): LabelSetting {
    return new LabelSetting(json.labelSettingId, json.name, json.description, json.defaultPage, json.labelOnPage, json.labelHeight,
      json.labelWidth, json.topMargin, json.rightMargin, json.bottomMargin, json.leftMargin);
  }

  static removeUnchangedLabelSetting(array: Array<LabelSetting>): Array<LabelSetting> {
    const cleanedSettings: Array<LabelSetting> = [];
    for (const oncHis of array) {
      if (oncHis.changed) {
        if (oncHis.description == null || oncHis.description === '') {
          oncHis.description = oncHis.name;
        }
        cleanedSettings.push(oncHis);
      }
    }
    return cleanedSettings;
  }
}
