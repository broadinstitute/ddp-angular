import {Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {map, exhaustMap, catchError, combineLatestWith, withLatestFrom} from "rxjs/operators";
import * as ParticipantActions from '../actions/participants.actions';
import {DSMService} from "../../services/dsm.service";
import {of} from "rxjs";
import {Store} from "@ngrx/store";
import {StoreStateModel} from "../store.reducer";
import {getPtsLoadingStatus} from "../selectors/combinedData.selectors";

@Injectable()
export class ParticipantsEffects {
  constructor(
    private actions$: Actions,
    private DSMService: DSMService,
  ) {
  }

  getParticipants$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ParticipantActions.getParticipantsRequest),
      exhaustMap(({viewFilter, realm, parent, filterQuery, from, to, sort}) => {
        return this.DSMService.applyFilter(viewFilter, realm, parent, filterQuery, from, to, sort)
          .pipe(
          map(({participants, totalCount}) => {
            return ParticipantActions.getParticipantsSuccess(participants, totalCount);
          }),
          catchError(({message}) => {
            return of(ParticipantActions.getParticipantsFailure(message))
          })
        )
      })
    )
  })

  getParticipant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ParticipantActions.getParticipantRequest),
      exhaustMap(({realm, participantId, parent}) => {
        return this.DSMService.getParticipantData(realm, participantId, parent)
          .pipe(
            map(([participant]) => {
              return ParticipantActions.getParticipantSuccess(participant);
            }),
            catchError(({message}) => {
              return of(ParticipantActions.getParticipantFailure(message))
            })
          )
      })
    )
  })
}
