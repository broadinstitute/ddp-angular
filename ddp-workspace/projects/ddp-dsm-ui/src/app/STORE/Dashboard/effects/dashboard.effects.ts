import {Actions, createEffect, ofType} from "@ngrx/effects";
import {DSMService} from "../../../services/dsm.service";
import * as DashboardActions from "../../Dashboard/actions/dashboard.actions";
import {catchError, exhaustMap, map} from "rxjs/operators";
import {of} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dsmService: DSMService) {
  }

  getDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardActions.getDashboardRequest),
    exhaustMap(({realm}) =>
      this.dsmService.getDashboardData(realm)
        .pipe(
          map((dashboardData) =>
            DashboardActions.getDashboardSuccess(dashboardData)
          ),
          catchError(({message}) => of(DashboardActions.getDashboardFailure(message)))
        ))
  ));

}
