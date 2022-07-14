import {DashboardStoreSelector} from '../../store.selector';
import {createSelector} from "@ngrx/store";
import {ChartFactory} from "./utils/charts-factory.util";

export const getDashboard = createSelector(
  DashboardStoreSelector,
  ({dashboardData}) => ChartFactory(dashboardData)
)
