import {createAction} from "@ngrx/store";
import {HttpErrorResponse} from "@angular/common/http";
import {getDashboard} from "./enums/dashboard-enums";
import {DashboardModel} from "../models/dashboard.model";

export const getDashboardRequest = createAction(
  getDashboard.REQUEST,
  (realm: string) => ({realm})
);
export const getDashboardSuccess = createAction(
  getDashboard.SUCCESS,
  (dashboardData: Partial<DashboardModel>[]) => ({dashboardData})
);
export const getDashboardFailure = createAction(
  getDashboard.FAILURE,
  (errorResponse: HttpErrorResponse) => ({errorResponse})
);
