export class AbstractionFieldValue {
  constructor(public medicalRecordAbstractionFieldId: number, public primaryKeyId: number, public value: string | string[],
              public valueCounter: number, public note: string, public question: string, public noData: boolean,
              public doubleCheck: boolean, public filePage: string, public fileName: string, public matchPhrase: string) {
  }

  static parse(json): AbstractionFieldValue {
    return new AbstractionFieldValue(
      json.medicalRecordAbstractionFieldId, json.primaryKeyId, json.value, json.valueCounter, json.note, json.question,
      json.noData, json.doubleCheck, json.filePage, json.fileName, json.matchPhrase
    );
  }
}
