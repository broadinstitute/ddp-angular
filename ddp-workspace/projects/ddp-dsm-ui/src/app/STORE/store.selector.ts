import {createFeatureSelector} from '@ngrx/store';
import {ParticipantsStoreState} from "./Participants/participants.reducer";
import {DashboardStoreState} from "./Dashboard/dashboard.reducer";

export const ParticipantsStoreSelector = createFeatureSelector<ParticipantsStoreState>('participants');
export const DashboardStoreSelector = createFeatureSelector<DashboardStoreState>('dashboard');

