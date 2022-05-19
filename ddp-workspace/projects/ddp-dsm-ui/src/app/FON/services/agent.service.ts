import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private loadingData$ = new BehaviorSubject<boolean>(false);


  constructor(private dsmService: DSMService) {
  }

  getPatients(): Observable<patientListModel[]> {
    this.loadingData$.next(true);
    return this.patients$.asObservable().pipe(map(data => data && this.collectParticipantData(data?.participants)));
  }

  getPatientsTotalCount(): Observable<number> {
    return this.patients$.asObservable().pipe(map(data => data && data?.totalCount));
  }

  getActivityInstances(guid: string): any {
    return this.patients$.asObservable().pipe(map(data => data && this.collectActivityGuids(data?.participants, guid)));
  }

  setPage(from: number, to: number): void {
    this.loadingData$.next(true);
    this.getPatientsRequest(from, to);
  }

  isLoading(): Observable<boolean> {
    return this.loadingData$.asObservable();
  }

  private getPatientsRequest(from?: number, to?: number): void {
    this.dsmService
      .applyFilter(null, this.STUDY, this.PARENT, null, from, to)
      .subscribe(data => {
        this.loadingData$.next(false);
        this.patients$.next(data);
      });
  }

  private collectActivityGuids(participants: any[], guid: string): any {
    return participants?.find(pt => pt?.esData.profile.guid === guid)?.esData.activities.map(pt => ({
      name: pt.activityCode,
      guid: pt.guid
    }));
  }

  private collectParticipantData(participants: any[]): patientListModel[] {
    return participants.map(pt => ({
      ID: pt.esData.profile.hruid,
      guid: pt.esData.profile.guid,
      firstName: pt.esData.profile.firstName,
      lastName: pt.esData.profile.lastName,
      birthdate: '01/01/2022',
      registered: '02/02/2002',
      lastUpdated: '01/01/2022',
    }));
  }
}
