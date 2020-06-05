import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService } from 'ddp-sdk';
import { ServiceAgent } from 'projects/ddp-sdk/src/lib/services/serviceAgents/serviceAgent.service';
import {DataAccessParameters} from "../../models/dataAccessParameters";

@Injectable()
export class DataAccessServiceAgent extends ServiceAgent<any> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService) {
    super(configuration, http, logger);
  }

  public createNewDataAccessRequest(dataAccessParameters: DataAccessParameters, researcher_biosketch: File, studyGuid: string): Observable<any> {
    const dataAccessParametersJson = JSON.stringify(dataAccessParameters);
    const formData = new FormData();
    formData.append('dataAccessParameters', dataAccessParametersJson);
    formData.append('researcher_biosketch', researcher_biosketch);
    return this.postObservable(`/studies/${studyGuid}/new_data_access_request`, formData);
  }
}
