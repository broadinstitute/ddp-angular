import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { UserProfile } from '../../models/userProfile';
import { UserProfileServiceAgent } from './userProfileServiceAgent.service';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<boolean> {
  private userDoNotDisplayObsSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gotInitialProfileValue = false;

  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    private profile: UserProfileServiceAgent) {
    super(configuration, http, logger);
  }

  private getStudyDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
    return this.getObservable(`/studies/${studyGuid}/display-language-popup`);
  }

  private getUserNotDisplayLanguagePopup(): Observable<boolean> {
    if (!this.gotInitialProfileValue) {
      // Make sure we return the starting value from the profile
      this.profile.profile.subscribe(res => this.userDoNotDisplayObsSource.next(res.profile.skipLanguagePopup));
    }
    return this.userDoNotDisplayObsSource;
  }

  public setUserDoNotDisplayLanguagePopup(userDoNotDisplay: boolean): void {
    // Update the value in the profile
    const userProfile = new UserProfile();
    userProfile.skipLanguagePopup = userDoNotDisplay;
    this.profile.updateProfile(userProfile).subscribe();

    // Update our cached value
    this.userDoNotDisplayObsSource.next(userDoNotDisplay);
  }

  public getShouldDisplayLanguagePopup(studyGuid: string): Observable<boolean> {
    const studyDisplayObservable: Observable<boolean> = this.getStudyDisplayLanguagePopup(studyGuid);
    const userNotDisplayObservable: Observable<boolean> = this.getUserNotDisplayLanguagePopup();

    return zip(studyDisplayObservable, userNotDisplayObservable)
      .pipe(map(([displayForStudy, doNotDisplayForUser]) => displayForStudy && !doNotDisplayForUser));
  }
}
