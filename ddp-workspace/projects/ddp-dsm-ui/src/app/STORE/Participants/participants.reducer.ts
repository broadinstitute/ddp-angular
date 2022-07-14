import {SettingsModel} from './models/settings.model';
import {ParticipantModel} from './models/participant.model';
import {createReducer, on} from '@ngrx/store';
import * as SettingsActions from './actions/settings.actions';
import * as ParticipantsActions from './actions/participants.actions';
import {HttpErrorResponse} from '@angular/common/http';

// Store State Models

export type ParticipantsStorePropsType = {
  data: SettingsModel | ParticipantObject | {};
  isLoaded: boolean;
  error: HttpErrorResponse | undefined;
};

export type ParticipantObject = {pts: ParticipantModel[]; totalCount: number};

export interface ParticipantsStoreState {
  settings: ParticipantsStorePropsType;
  participants: ParticipantsStorePropsType;
}

// Initial State
const ParticipantsStoreInitialState: ParticipantsStoreState = {
  settings: {
    data: {},
    isLoaded: false,
    error: undefined,
  },
  participants: {
    data: {},
    isLoaded: false,
    error: undefined,
  },
};

// Reducer implementation
export const participantsReducer = createReducer<ParticipantsStoreState>(
  ParticipantsStoreInitialState,


  on(SettingsActions.getSettingsRequest, (state, _) => ({
      ...state,
      settings: {
        ...state.settings,
        isLoaded: false
      }
    })),
  on(SettingsActions.getSettingsSuccess, (state, action) => ({
      ...state,
      settings: {
        ...state.settings,
        data: action.settings,
        isLoaded: true
      }
    })),
  on(SettingsActions.getSettingsFailure, (state, action) => ({
      ...state,
      settings: {
        ...state.settings,
        isLoaded: false,
        error: action.errorResponse
      },
    })),


  on(ParticipantsActions.getParticipantsRequest, (state, _) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: false,
      }
    })),
  on(ParticipantsActions.getParticipantsSuccess, (state, action) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: true,
        data: {
          pts: action.participants,
          totalCount: action.totalCount
        }
      }
    })),
  on(ParticipantsActions.getParticipantsFailure, (state, action) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: false,
        error: action.errorResponse
      }
    })),


  on(ParticipantsActions.getParticipantRequest, (state, _) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: false,
      }
    })),
  on(ParticipantsActions.getParticipantSuccess, (state, action) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: true,
        data: {
          ...state.participants.data,
          pts: [action.participant],
        }
      }
    })),
  on(ParticipantsActions.getParticipantsFailure, (state, action) => ({
      ...state,
      participants: {
        ...state.participants,
        isLoaded: false,
        error: action.errorResponse
      }
    })),
);
