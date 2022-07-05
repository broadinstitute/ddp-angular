import {createAction} from '@ngrx/store';
import {getSettings} from './enums/settings-enums';
import {SettingsModel} from '../models/settings.model';
import {HttpErrorResponse} from '@angular/common/http';

export const getSettingsRequest = createAction(
  getSettings.REQUEST,
  (study: string, parent: string) => ({study, parent})
);
export const getSettingsSuccess = createAction(
  getSettings.SUCCESS,
  (settings: SettingsModel) => ({settings})
);
export const getSettingsFailure = createAction(
  getSettings.FAILURE,
  (errorResponse: HttpErrorResponse) => ({errorResponse})
);
