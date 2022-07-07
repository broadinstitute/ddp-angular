import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddPatientModel} from '../models/addPatient.model';
import {Observable} from 'rxjs';
import {ConfigurationService} from 'ddp-sdk';

@Injectable()
export class HttpService {
  readonly ADD_PATIENT_URL = `${this.config.backendUrl}/pepper/v1/user`;

  constructor(private httpClient: HttpClient, @Inject('ddp.config') private config: ConfigurationService) {
  }

  addPatient(addPatientModel: AddPatientModel): Observable<any> {
    return this.httpClient.post(this.ADD_PATIENT_URL, addPatientModel);
  }
}
