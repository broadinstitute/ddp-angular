import {Injectable} from '@angular/core';
import {exhaustMap, finalize, map, shareReplay, take, tap} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, iif, Observable, ObservableInput, of} from 'rxjs';
import {DSMService} from '../../services/dsm.service';
import {patientListModel} from '../pages/participantsList/models/participantList.model';

export interface Patients {
  patients: patientListModel[];
  totalCount: number;
}

@Injectable()
export class AgentService {
  readonly STUDY = 'fon';
  readonly PARENT = 'participantList';

  private patients$ = new BehaviorSubject<any>(null);
  private settings$ = new BehaviorSubject<any>(null);
  private loadingData$ = new BehaviorSubject<boolean>(false);
  private totalCount$ = new BehaviorSubject<number>(0);


  constructor(private dsmService: DSMService) {
    this.getSettings().subscribe();
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
    return this.settings$.asObservable()
      .pipe(exhaustMap((settings) =>
        iif(() => settings,
          this.getFullPatientData(settings, fromPage, toPage),
          of(null)
        )
      ));
  }

  private getFullPatientData(settings: any, fromPage: number, toPage: number): Observable<any> {
    const jsonData = localStorage.getItem('pListQueryParams');
    const {from, to} = jsonData && JSON.parse(jsonData);

    return this.getPatientsRequest(fromPage || from || 0, toPage || to || 10).pipe(
      tap(patients => {
        this.totalCount$.next(patients.totalCount);
        this.patients$.next(this.collectParticipantData(patients.participants, settings.activityDefinitions));
        this.loadingData$.next(false);
      })
    );
  }

  private getPatientsRequest(from?: number, to?: number): Observable<any> {
    return this.dsmService
      .applyFilter(null, this.STUDY, this.PARENT, null, from, to)
      .pipe();
  }

  private getSettings(): Observable<any> {
    return this.dsmService.getSettings(this.STUDY, this.PARENT)
      .pipe(
        tap(data => this.settings$.next(data)),
        take(1)
      );
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
