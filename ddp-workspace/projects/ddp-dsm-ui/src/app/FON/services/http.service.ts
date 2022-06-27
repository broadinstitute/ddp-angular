import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AddPatientModel} from "../models/addPatient.model";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class HttpService {
  readonly BASE_URL = 'https://pepper-dev.datadonationplatform.org/pepper/v1/user';

  constructor(private httpClient: HttpClient) {
  }

  addPatient(addPatientModel: AddPatientModel): Observable<any> {
    return this.httpClient.post(this.BASE_URL, addPatientModel);
  }
}
