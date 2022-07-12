import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddPatientModel} from '../models/addPatient.model';
import {Observable} from 'rxjs';
import {sdkConfig} from '../../app.module';

@Injectable()
export class HttpService {
  readonly ADD_PATIENT_URL = `${sdkConfig.backendUrl}/pepper/v1/user`;

  constructor(private httpClient: HttpClient) {
  }

  addPatient(addPatientModel: AddPatientModel): Observable<any> {
    return this.httpClient.post(this.ADD_PATIENT_URL, addPatientModel);
  }

  get getDashboardData(): Observable<any> {
    return this.httpClient.get('assets/tempJson.json');
  }
}
