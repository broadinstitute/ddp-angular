import { Inject, Injectable } from '@angular/core';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StudyDisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<boolean> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService) {
    super(configuration, http, logger);
  }

  public getStudyDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
    return this.getObservable(`/studies/${studyGuid}/display-language-popup`);
  }
}
