import {createSelector} from '@ngrx/store';
import {ParticipantsStoreSelector} from '../../store.selector';
import {ParticipantObject} from '../participants.reducer';

export const getParticipants = createSelector(
  ParticipantsStoreSelector,
  ({participants}) => participants.data
);

export const getParticipantsTotalCount = createSelector(
  getParticipants,
  (participantsData: ParticipantObject) => participantsData?.totalCount
);

export const getParticipantsErrorState = createSelector(
  ParticipantsStoreSelector,
  ({participants}) => participants.error
);
