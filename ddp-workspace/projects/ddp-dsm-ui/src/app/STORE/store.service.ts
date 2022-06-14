import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {StoreStateModel} from './store.reducer';
import * as ParticipantsActions from './actions/participants.actions';
import * as SettingsActions from './actions/settings.actions';
import {Observable} from 'rxjs';
import {
  getErrorStatus,
  getPtsLoadingStatus, getParticipantActivities,
  getParticipantsList
} from './selectors/combinedData.selectors';
import {getParticipantsTotalCount} from './selectors/participants.selectors';

@Injectable({providedIn: 'root'})
export class StoreService {
  private currentStudy: string;

  constructor(private store: Store<StoreStateModel>) {
  }

  public set setStudy(study: string) {
     this.currentStudy = study;
  }

  public get getParticipantsTotalCount(): Observable<number> {
    return this.store.select(getParticipantsTotalCount);
  }

  public get getParticipantsLoadingStatus(): Observable<boolean> {
    return this.store.select(getPtsLoadingStatus);
  }

  public getParticipants(from = 0, to = 10, parent: string): Observable<any> {
    this.dispatchGetParticipants(from, to, parent);
    return this.store.select(getParticipantsList);
  }

  public dispatchGetParticipant(guid: string, parent): void {
    this.store.dispatch(ParticipantsActions.getParticipantRequest(this.currentStudy, guid, parent));
  }

  public getParticipantActivities(guid: string): Observable<any> {
    return this.store.select(getParticipantActivities(guid));
  }

  public dispatchGetSettings(parent: string): void {
    this.store.dispatch(SettingsActions.getSettingsRequest(this.currentStudy, parent));
  }

  public get getErrorState(): Observable<string> {
    return this.store.select(getErrorStatus);
  }

  public dispatchGetParticipants(from: number, to: number, parent: string): void {
    this.store.dispatch(ParticipantsActions.getParticipantsRequest(null, this.currentStudy, parent, null, from, to, null));
  }


}
