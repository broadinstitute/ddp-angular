import {createAction} from "@ngrx/store";
import {getSettings} from "./enums/settings-enums";
import {SettingsModel} from "../models/settings.model";

export const getSettingsRequest = createAction(
  getSettings.REQUEST,
  (study: string, parent: string) => ({study, parent})
)
export const getSettingsSuccess = createAction(
  getSettings.SUCCESS,
  (settings: SettingsModel) => ({settings})
)
export const getSettingsFailure = createAction(
  getSettings.FAILURE,
  (errorMessage: string) => ({errorMessage})
)
