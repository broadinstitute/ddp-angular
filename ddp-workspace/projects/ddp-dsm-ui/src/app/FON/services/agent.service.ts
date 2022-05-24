import { Injectable } from '@angular/core';
import { finalize, map, tap} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, Observable, ObservableInput} from 'rxjs';
import { DSMService } from '../../services/dsm.service';
import { patientListModel } from '../pages/participantsList/models/participantList.model';

export interface Patients {
  patients: patientListModel[];
  totalCount: number;
}

@Injectable()
export class AgentService {
  readonly STUDY = 'fon';
  readonly PARENT = 'participantList';

  private patients$ = new BehaviorSubject<any>(null);
  private settings$ =  new BehaviorSubject<any>(null);
  private loadingData$ = new BehaviorSubject<boolean>(false);
  private totalCount$ = new BehaviorSubject<number>(0);


  constructor(private dsmService: DSMService) {
  }

  getPatients(): Observable<patientListModel[]> {
    this.loadingData$.next(true);
    return this.patients$.asObservable();
  }

  getPatientsTotalCount(): Observable<number> {
    return this.totalCount$.asObservable();
  }

  getActivityInstances(guid: string): any {
    this.loadingData$.next(true);

    return this.patients$
      .pipe(
        map(data => data?.find(pt => pt.guid === guid)
        ),
        finalize(() => this.loadingData$.next(false))
      );
  }

  setPage(from: number, to: number): ObservableInput<any> {
    this.loadingData$.next(true);
    this.patients$.next(null);
    return this.getAll(from, to);
  }

  isLoading(): Observable<boolean> {
    return this.loadingData$.asObservable();
  }

  public getAll(fromPage?: number, toPage?: number): Observable<any> {
    const {from, to} = JSON.parse(localStorage.getItem('pListQueryParams'));

   return forkJoin([this.getPatientsRequest(fromPage || from || 0, toPage || to || 10), this.getSettings() ])
      .pipe(
        tap(([patients, settings]) => {
          this.totalCount$.next(patients.totalCount);
          this.patients$.next(this.collectParticipantData(patients.participants, settings.activityDefinitions));
          this.settings$.next(settings);
          this.loadingData$.next(false);
        }
        ),
      );
  }

  private getPatientsRequest(from?: number, to?: number): Observable<any> {
    return this.dsmService
      .applyFilter(null, this.STUDY, this.PARENT, null, from, to);
  }

  private getSettings(): Observable<any> {
    return this.dsmService.getSettings(this.STUDY, this.PARENT).pipe(tap(data => this.settings$.next(data)));
  }
  

  private collectParticipantData(patients: any[], actDefs: any): patientListModel[] {
    return patients.map(pt => ({
      ID: pt.esData.profile.hruid,
      guid: pt.esData.profile.guid,
      firstName: pt.esData.profile.firstName,
      lastName: pt.esData.profile.lastName,
      birthdate: '01/01/2022',
      registered: '02/02/2002',
      lastUpdated: '01/01/2022',
      activities: pt.esData.activities.map(activity => ({
        activityName: Object.values(actDefs).find(actDef => actDef['activityCode'] === activity.activityCode)['activityName'],
        activityGuid: activity.guid
      }))
    }));
  }
}
