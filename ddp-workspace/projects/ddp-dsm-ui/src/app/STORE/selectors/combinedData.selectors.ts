import {createSelector, MemoizedSelector} from '@ngrx/store';
import {getParticipants} from './participants.selectors';
import {getSettings} from './settings.selectors';
import {SettingsModel} from '../models/settings.model';
import {generateGroupedActivities, generateParticipantsList} from './Utils/participantsList.util';
import {ParticipantObject, StoreStateModel} from '../store.reducer';
import {MainStoreFeatureSelector} from './mainStoreFeature.selector';

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

export const getSections = (): MemoizedSelector<any, any> => createSelector(getSections);

export const getPtsLoadingStatus = createSelector(
  MainStoreFeatureSelector,
  ({participants, settings}: StoreStateModel) =>
    [participants.isLoaded, settings.isLoaded].some(bool => !bool)
);

export const getErrorStatus = createSelector(
  MainStoreFeatureSelector,
  ({error}) => error
);
