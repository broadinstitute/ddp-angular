import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddPatientModel} from '../models/addPatient.model';
import {Observable} from 'rxjs';

declare const DDP_ENV;

@Injectable()
export class HttpService {
  readonly ADD_PATIENT_URL = `${DDP_ENV.backendUrl}/pepper/v1/user`;

  constructor(private httpClient: HttpClient) {
  }

  addPatient(addPatientModel: AddPatientModel): Observable<any> {
    return this.httpClient.post(this.ADD_PATIENT_URL, addPatientModel);
  }
}
