import {ParticipantColumnModel} from './participantColumn.model';

export interface FiltersModel {
  empty: boolean;
  exactMatch: boolean;
  filter1: { name: string; value: string };
  notEmpty: boolean;
  parentName: string;
  participantColumn: ParticipantColumnModel;
  range: boolean;
  selectedOptions: any[];
  type: string;
}
