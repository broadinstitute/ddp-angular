import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, exhaustMap, catchError} from 'rxjs/operators';
import * as ParticipantActions from '../actions/participants.actions';
import {DSMService} from '../../../services/dsm.service';
import {of} from 'rxjs';

@Injectable()
export class ParticipantsEffects {
  constructor(
    private actions$: Actions,
    private dsmService: DSMService,
  ) {
  }

  getParticipants$ = createEffect(() => this.actions$.pipe(
      ofType(ParticipantActions.getParticipantsRequest),
      exhaustMap(({viewFilter, realm, parent, filterQuery, from, to, sort}) =>
        this.dsmService.applyFilter(viewFilter, realm, parent, filterQuery, from, to, sort)
          .pipe(
          map(({participants, totalCount}) =>
            ParticipantActions.getParticipantsSuccess(participants, totalCount)),
          catchError(({message}) => of(ParticipantActions.getParticipantsFailure(message)))
        ))
    ));

  getParticipant$ = createEffect(() => this.actions$.pipe(
      ofType(ParticipantActions.getParticipantRequest),
      exhaustMap(({realm, participantId, parent}) => this.dsmService.getParticipantData(realm, participantId, parent)
          .pipe(
            map(([participant]) => ParticipantActions.getParticipantSuccess(participant)),
            catchError(({message}) => of(ParticipantActions.getParticipantFailure(message)))
          ))
    ));
}
