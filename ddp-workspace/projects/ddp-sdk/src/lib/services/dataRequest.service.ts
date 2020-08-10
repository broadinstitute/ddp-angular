import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService, LanguageService } from 'ddp-sdk';
import { ServiceAgent } from './serviceAgents/serviceAgent.service';
import { Observable } from 'rxjs';
import { DataRequest } from '../models/dataRequest';

@Injectable()
export class DataRequestService extends ServiceAgent<any> {
  constructor(@Inject('ddp.config') configuration: ConfigurationService,
              http: HttpClient,
              logger: LoggingService,
              language: LanguageService) {
    super(configuration, http, logger, language);
  }

  public sendDataRequest(dataRequestOptions: DataRequest): Observable<any> {
    const dataRequest = JSON.stringify(dataRequestOptions);
    const formData = new FormData();
    formData.append('dataRequestOptions', dataRequest);
    return this.postObservable(`/studies/${this.configuration.studyGuid}/data_request`, formData);
  }
}
