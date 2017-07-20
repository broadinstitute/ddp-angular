import {Injectable, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {errorHandler} from "@angular/platform-browser/src/browser";
import {GenericErrorHandler} from "../generic-error-handler";
import {UmbrellaConfig} from "../umbrella-config/umbrella-config";

@Injectable()
export class OperatorService {

  constructor(private http: Http,private umbrellaConfig:UmbrellaConfig,private errorHandler:GenericErrorHandler) { }

  // todo arz general approach to error handling: pass through, but with
  // allowances for special codes for site downtime and re-auth.  Otherwise,
  // generic error message shows up.
  // module for handling errors, injected, as interface, may also want to put
  // remote logging in there

  public getParticipants(operatorId): Observable<Participant[]> {
    let response: Observable<Response> = this.http.get(this.umbrellaConfig.getBaseUrl() + "/operator/" + operatorId);

    return Observable.create(observer => {
      response.subscribe(
        (res:Response) => {
          if (!this.errorHandler.handleErrors(res)) {
            observer.next(res.json());
          }
          observer.complete();
        },
        (error:any) => {
          this.errorHandler.handleGenericError(error);
        },
      );
    });

  }

}

export class Participant {

  constructor(public alias:string,public participantId:string) {}
}
