import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {StoreStateModel} from './store.reducer';
import * as ParticipantsActions from './actions/participants.actions';
import * as SettingsActions from './actions/settings.actions';
import {Observable} from 'rxjs';
import {
  getPtsLoadingStatus, getParticipantActivities,
  getParticipantsList
} from './selectors/combinedData.selectors';
import {
  getParticipantsErrorState,
  getParticipantsTotalCount
} from './selectors/participants.selectors';
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class StoreService {
  private currentStudy: string;

  constructor(private store: Store<StoreStateModel>) {
  }

  /* Setters */

  public set setStudy(study: string) {
     this.currentStudy = study;
  }

  /* Combined */

  public getParticipants(from = 0, to = 10, parent: string): Observable<any> {
    this.dispatchGetParticipants(from, to, parent);
    return this.store.select(getParticipantsList);
  }

  /* Getters */

  public get getParticipantsTotalCount(): Observable<number> {
    return this.store.select(getParticipantsTotalCount);
  }

  public get getParticipantsErrorState(): Observable<HttpErrorResponse> {
    return this.store.select(getParticipantsErrorState);
  }

  public get getParticipantsLoadingStatus(): Observable<boolean> {
    return this.store.select(getPtsLoadingStatus);
  }

  public getParticipantActivities(guid: string): Observable<any> {
    return this.store.select(getParticipantActivities(guid));
  }



  /* Dispatchers */

  public dispatchGetParticipants(from: number, to: number, parent: string): void {
    this.store.dispatch(ParticipantsActions.getParticipantsRequest(null, this.currentStudy, parent, null, from, to, null));
  }

  public dispatchGetParticipant(guid: string, parent): void {
    this.store.dispatch(ParticipantsActions.getParticipantRequest(this.currentStudy, guid, parent));
  }

  public dispatchGetSettings(parent: string): void {
    this.store.dispatch(SettingsActions.getSettingsRequest(this.currentStudy, parent));
  }


}
