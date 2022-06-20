import {createSelector} from '@ngrx/store';
import {MainStoreFeatureSelector} from './mainStoreFeature.selector';

export const getSettings = createSelector(
  MainStoreFeatureSelector,
  ({settings}) => settings.data
);
