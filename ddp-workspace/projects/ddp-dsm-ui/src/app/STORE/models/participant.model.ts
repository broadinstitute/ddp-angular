import {
  AbstractionActivitiesModel,
  AbstractionGroupModel,
  EsDataModel, SampleModel,
  MedicalRecordModel,
  OncHistoryDetailModel,
  ParticipantDataModel
}
  from './';

export interface ParticipantModel {
  abstractionActivities: AbstractionActivitiesModel[];
  abstractionSummary: AbstractionGroupModel[];
  esData: EsDataModel;
  kits: SampleModel[];
  medicalRecords: Partial<MedicalRecordModel>[];
  oncHistoryDetails: OncHistoryDetailModel[];
  participant: object;
  participantData: ParticipantDataModel[];
  proxyData: EsDataModel[];
}
