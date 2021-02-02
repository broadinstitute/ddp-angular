import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService, LanguageService, ServiceAgent } from 'ddp-sdk';
import { DataAccessParameters } from '../../models/dataAccessParameters';

@Injectable()
export class DataAccessServiceAgent extends ServiceAgent<any> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    language: LanguageService) {
    super(configuration, http, logger, language);
  }

  public createNewDataAccessRequest(
      dataAccessParameters: DataAccessParameters,
      researcherBiosketch: File,
      studyGuid: string): Observable<any> {
      const dataAccessParametersJson = JSON.stringify(dataAccessParameters);
      const formData = new FormData();
      formData.append('dataAccessParameters', dataAccessParametersJson);
      formData.append('researcher_biosketch', researcherBiosketch);
      return this.postObservable(`/studies/${studyGuid}/new_data_access_request`, formData);
  }
}
