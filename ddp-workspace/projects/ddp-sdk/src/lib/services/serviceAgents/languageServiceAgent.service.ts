import { Inject, Injectable } from "@angular/core";
import { StudyLanguage } from "../../models/studyLanguage";
import { NotAuthenticatedServiceAgent } from "./notAuthenticatedServiceAgent.service";
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LanguageServiceAgent extends NotAuthenticatedServiceAgent<Array<StudyLanguage>> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService) {
    super(configuration, http, logger);
  }

  public getConfiguredLanguages(studyGuid: string): Observable<Array<StudyLanguage>> {
    return this.getObservable(`/studies/${studyGuid}/languages`);
  }
}
