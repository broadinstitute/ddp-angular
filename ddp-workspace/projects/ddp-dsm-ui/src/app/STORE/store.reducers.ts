import {ActionReducerMap} from "@ngrx/store";
import {participantsReducer} from "./Participants/participants.reducer";
import {dashboardReducer} from "./Dashboard/dashboard.reducer";

export interface AppStoreState {
  participants: any,
  dashboard: any
}

export const StoreReducers: ActionReducerMap<AppStoreState> = {
  participants: participantsReducer,
  dashboard: dashboardReducer
}

