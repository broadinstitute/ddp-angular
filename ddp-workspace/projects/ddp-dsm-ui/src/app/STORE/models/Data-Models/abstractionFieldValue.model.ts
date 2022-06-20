export interface AbstractionFieldValueModel {
  medicalRecordAbstractionFieldId: number;
  primaryKeyId: number;
  value: string | string [];
  valueCounter: number;
  note: string;
  question: string;
  noData: boolean;
  doubleCheck: boolean;
  filePage: string;
  fileName: string;
  matchPhrase: string;
}
