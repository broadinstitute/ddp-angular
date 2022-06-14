import {
  AbstractionFieldModel,
  ActivityDefinitionModel,
  AssigneeModel,
  FieldSettingsModel,
  FilterModel,
  KitTypeModel,
  PreferredLanguageModel
}
  from "./";

export interface SettingsModel {
  abstractionFields: AbstractionFieldModel,
  activityDefinitions: {[index: string]: ActivityDefinitionModel},
  assignees: AssigneeModel[];
  cancers: string[];
  ddpInstanceId: number;
  defaultColumns: any[];
  drugs: string[];
  fieldSettings: FieldSettingsModel;
  filters: FilterModel[];
  gbfShippedTriggerDSSDelivered: boolean;
  hasAddressTab: boolean;
  hasComputedObject: boolean;
  hasInvitations: boolean;
  hideESFields: {value: string}[];
  hideSamplesTab: boolean;
  instanceSettingsId: boolean;
  kitBehaviorChange: any[];
  kitTypes: KitTypeModel[];
  mrCoverPdf: { value: string; name: string; type: string }[];
  preferredLanguages: PreferredLanguageModel[];
  specialFormat: any[];
  studySpecificStatuses: { value: string; name: string }[];
}
