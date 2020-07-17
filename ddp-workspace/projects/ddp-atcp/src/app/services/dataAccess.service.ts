import { Injectable } from '@angular/core';
import { DataAccessServiceAgent } from './serviceAgents/dataAccessServiceAgent.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataAccessRequestSuccessResult } from '../models/dataAccessRequestSuccessResult';
import { DataAccessRequestError } from '../models/dataAccessRequestError';
import {DataAccessParameters} from "../models/dataAccessParameters";

@Injectable()
export class DataAccessService {
  constructor(private dataAccessServiceAgent: DataAccessServiceAgent) {
  }

public createNewDataAccessRequest(dataAccessParameters: DataAccessParameters, researcherBiosketch: File, studyGuid: string): Observable<DataAccessRequestSuccessResult> {
   return this.dataAccessServiceAgent.createNewDataAccessRequest(dataAccessParameters, researcherBiosketch, studyGuid)
     .pipe(
     map((data: any) => {
       return new DataAccessRequestSuccessResult(data.code, data.message);
     }),
     catchError((error) => {
       return Observable.throw(error.error as DataAccessRequestError);
     })
   );
  }
}
