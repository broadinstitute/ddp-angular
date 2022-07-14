import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {DashboardModel} from "./models/dashboard.model";
import {AppStoreState} from "../store.reducers";
import {Store} from "@ngrx/store";
import * as DashboardActions from './actions/dashboard.actions'
import {getDashboard} from "./selectors/dashboard.selector";

@Injectable({providedIn: 'root'})
export class DashboardStoreService {
  private currentStudy:string;

  constructor(private store: Store<AppStoreState>) {
  }

  /* Setters */

  public set setStudy(study: string) {
    this.currentStudy = study;
  }

  /* Combined */

  public get getDashboard(): Observable<Partial<DashboardModel>[]> {
    this.dispatchGetDashboard();
    return this.store.select(getDashboard);
  }

  /* Dispatchers */

  public dispatchGetDashboard(): void {
    this.store.dispatch(DashboardActions.getDashboardRequest(this.currentStudy));
  }


}
