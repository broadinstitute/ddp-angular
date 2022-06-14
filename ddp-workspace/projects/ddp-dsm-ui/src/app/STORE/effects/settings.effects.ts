import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, exhaustMap, catchError} from 'rxjs/operators';
import * as SettingsActions from '../actions/settings.actions';
import {DSMService} from '../../services/dsm.service';
import {of} from 'rxjs';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private dsmService: DSMService,
  ) {
  }

  getSettings$ = createEffect(() => this.actions$.pipe(
      ofType(SettingsActions.getSettingsRequest),
      exhaustMap(({study, parent}) => this.dsmService.getSettings(study, parent).pipe(
          map(settings => SettingsActions.getSettingsSuccess(settings)),
          catchError(({message}) => of(SettingsActions.getSettingsFailure(message)))
        ))
    ));


}
