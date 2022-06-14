import {createSelector} from '@ngrx/store';
import {MainStoreFeatureSelector} from './mainStoreFeature.selector';
import {ParticipantObject} from '../store.reducer';

export const getParticipants = createSelector(
  MainStoreFeatureSelector,
  ({participants}) => participants.data
);

export const getParticipantsTotalCount = createSelector(
  getParticipants,
  (participantsData: ParticipantObject) => participantsData?.totalCount
);
