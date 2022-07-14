import {createSelector, MemoizedSelector} from '@ngrx/store';
import {getParticipants} from './participants.selectors';
import {getSettings} from './settings.selectors';
import {SettingsModel} from '../models/settings.model';
import {generateGroupedActivities, generateParticipantsList} from './Utils/participants.util';
import {ParticipantObject, ParticipantsStoreState} from '../participants.reducer';
import {ParticipantsStoreSelector} from '../../store.selector';

export const getParticipantsList = createSelector(
  getParticipants,
  getSettings,
  (participants: ParticipantObject, settings: SettingsModel) =>
    generateParticipantsList(participants.pts, settings)
);

export const getParticipantActivities = (patientGuid: string): MemoizedSelector<any, any> => createSelector(
    getParticipantsList,
    participants => generateGroupedActivities(participants?.find(pt => pt.guid === patientGuid))
  );

export const getPtsLoadingStatus = createSelector(
  ParticipantsStoreSelector,
  ({participants, settings}: ParticipantsStoreState) =>
    [participants.isLoaded, settings.isLoaded].some(bool => !bool)
);

