import {createSelector} from '@ngrx/store';
import {ParticipantsStoreSelector} from '../../store.selector';

export const getSettings = createSelector(
  ParticipantsStoreSelector,
  ({settings}) => settings.data
);
