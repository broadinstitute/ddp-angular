import {createAction} from '@ngrx/store';
import {getParticipant, getParticipants} from './enums/participants-enums';
import {ViewFilter} from '../../filter-column/models/view-filter.model';
import {Sort} from '../../sort/sort.model';
import {ParticipantModel} from '../models/participant.model';

export const getParticipantsRequest = createAction(
  getParticipants.REQUEST,
  (viewFilter: ViewFilter, realm: string, parent: string, filterQuery: string,
   from: number, to: number, sort: Sort) => ({viewFilter, realm, parent, filterQuery, from, to, sort})
);
export const getParticipantsSuccess = createAction(
  getParticipants.SUCCESS,
  (participants: ParticipantModel[], totalCount: number) => ({participants, totalCount})
);
export const getParticipantsFailure = createAction(
  getParticipants.FAILURE,
  (errorMessage: string) => ({errorMessage})
);


export const getParticipantRequest = createAction(
  getParticipant.REQUEST,
  (realm: string, participantId: string, parent: string) => ({realm, participantId, parent})
);
export const getParticipantSuccess = createAction(
  getParticipant.SUCCESS,
  (participant: ParticipantModel) => ({participant})
);
export const getParticipantFailure = createAction(
  getParticipant.FAILURE,
  (errorMessage: string) => ({errorMessage})
);
