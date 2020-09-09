import { Inject, Injectable } from '@angular/core';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { HttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { UserProfileDecorator } from '../../models/userProfileDecorator';
import { UserProfileServiceAgent } from './userProfileServiceAgent.service';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class DisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<boolean> {
  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    private profile: UserProfileServiceAgent) {
    super(configuration, http, logger);
  }

  // TODO: Tap is temporary but demonstrates that for some reason this is outputting false instead of true...
  private getStudyDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
    return this.getObservable(`/studies/${studyGuid}/display-language-popup`)
      .pipe(tap(x => {
      console.log('tapping' + x);
    }));
  }

  private getUserNotDisplayLanguagePopup(): Observable<boolean> {
    return this.profile.profile
      .pipe(
        map((decorator: UserProfileDecorator) => {
          return decorator.profile.skipLanguagePopup;
        }));
  }

  public shouldDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
    const studyDisplayObservable: Observable<boolean> = this.getStudyDisplayLanguagePopup(studyGuid);
    const userNotDisplayObservable: Observable<boolean> = this.getUserNotDisplayLanguagePopup();

    return zip(studyDisplayObservable, userNotDisplayObservable)
      .pipe(map(([study, user]) => study && !user));
  }
}
