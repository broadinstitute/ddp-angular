import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { StudyDetailServiceAgent } from './studyDetailServiceAgent.service';
import { UserProfile } from '../../models/userProfile';
import { UserProfileServiceAgent } from './userProfileServiceAgent.service';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';

@Injectable()
export class DisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<boolean> {
  private userDoNotDisplayObsSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    private profile: UserProfileServiceAgent,
    private studyDetailAgent: StudyDetailServiceAgent) {
    super(configuration, http, logger);
   }

  public setUserDoNotDisplayLanguagePopup(userDoNotDisplay: boolean): void {
    // Update the value in the profile
    const userProfile = new UserProfile();
    userProfile.skipLanguagePopup = userDoNotDisplay;
    this.profile.updateProfile(userProfile).pipe(take(1)).subscribe();

    // Update our cached value
    this.userDoNotDisplayObsSource.next(userDoNotDisplay);
  }

  public getShouldDisplayLanguagePopup(): Observable<boolean> {
    const studyDisplayObservable: Observable<boolean> = this.getStudyDisplayLanguagePopup();
    const userNotDisplayObservable: Observable<boolean> = this.getUserNotDisplayLanguagePopup();

    return zip(studyDisplayObservable, userNotDisplayObservable)
      .pipe(map(([displayForStudy, doNotDisplayForUser]) => displayForStudy && !doNotDisplayForUser));
  }

  private getStudyDisplayLanguagePopup(): Observable<boolean> {
    return this.studyDetailAgent.studyDetail.pipe(map(res => true === res.shouldDisplayLanguageChangePopup));
  }

  private getUserNotDisplayLanguagePopup(): Observable<boolean> {
    // Make sure we return the starting value from the profile
    this.profile.profile
      .pipe(take(1))
      .subscribe(res => this.userDoNotDisplayObsSource.next(true === res.profile.skipLanguagePopup));
    return this.userDoNotDisplayObsSource.pipe(skip(1)); // Skip the initial false value
  }
}
