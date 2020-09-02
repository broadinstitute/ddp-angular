import { Inject, Injectable } from "@angular/core";
import { NotAuthenticatedServiceAgent } from "./notAuthenticatedServiceAgent.service";
import { ConfigurationService, LoggingService } from "ddp-sdk";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class StudyDisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<Boolean> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService) {
    super(configuration, http, logger);
  }

  public getStudyDisplayLanguagePopup(studyGuid: string): Observable<Boolean> {
    return this.getObservable(`/studies/${studyGuid}/display-language-popup`);
  }
}
