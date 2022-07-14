import {createReducer, on} from "@ngrx/store";
import {DashboardModel} from "./models/dashboard.model";
import * as DashboardActions from './actions/dashboard.actions'
import {HttpErrorResponse} from "@angular/common/http";

export interface DashboardStoreState {
  dashboardData: Partial<DashboardModel>[];
  isLoading: boolean;
  error: HttpErrorResponse | null
}

const DashboardStoreInitialState: DashboardStoreState = {
  dashboardData: [],
  isLoading: false,
  error: null
}

export const dashboardReducer = createReducer<any>(
  DashboardStoreInitialState,
  on(DashboardActions.getDashboardRequest, (state, _) => ({
    ...state,
    isLoading: true
  })),

  on(DashboardActions.getDashboardSuccess, (state, action) => ({
    ...state,
    dashboardData: action.dashboardData,
    isLoading: false
  })),

  on(DashboardActions.getDashboardFailure, (state, action) => ({
    ...state,
    error: action.errorResponse,
    isLoading: false
  }))
)
