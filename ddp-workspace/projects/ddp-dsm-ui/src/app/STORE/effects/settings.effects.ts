import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, exhaustMap, catchError} from "rxjs/operators";
import * as SettingsActions from '../actions/settings.actions';
import {DSMService} from "../../services/dsm.service";
import {of} from "rxjs";
import * as ParticipantActions from "../actions/participants.actions";

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private DSMService: DSMService,
  ) {
  }

  getSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.getSettingsRequest),
      exhaustMap(({study, parent}) => {
        return this.DSMService.getSettings(study, parent).pipe(
          map(settings => {
            return SettingsActions.getSettingsSuccess(settings)
          }),
          catchError(({message}) => {
            return of(SettingsActions.getSettingsFailure(message))
          })
        )
      })
    )
  })


}
