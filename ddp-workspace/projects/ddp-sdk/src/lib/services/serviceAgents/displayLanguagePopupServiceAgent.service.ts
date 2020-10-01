import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { StudyDetailServiceAgent } from './studyDetailServiceAgent.service';
import { UserProfile } from '../../models/userProfile';
import { UserProfileServiceAgent } from './userProfileServiceAgent.service';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import { CompositeDisposable } from '../../compositeDisposable';

@Injectable()
export class DisplayLanguagePopupServiceAgent extends NotAuthenticatedServiceAgent<boolean> implements OnDestroy {
  private userDoNotDisplayObsSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly anchor: CompositeDisposable;

  constructor(
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    private profile: UserProfileServiceAgent,
    private studyDetailAgent: StudyDetailServiceAgent) {
    super(configuration, http, logger);
    this.anchor = new CompositeDisposable();
  }

  private getStudyDisplayLanguagePopup(): Observable<boolean> {
    return this.studyDetailAgent.studyDetail.pipe(map(res => res.shouldDisplayLanguageChangePopup));
  }

  private getUserNotDisplayLanguagePopup(): Observable<boolean> {
    // Make sure we return the starting value from the profile
    const sub = this.profile.profile
        .pipe(take(1))
        .subscribe(res => this.userDoNotDisplayObsSource.next(res.profile.shouldSkipLanguagePopup));
    this.anchor.addNew(sub);
    return this.userDoNotDisplayObsSource.pipe(skip(1)); // Skip the initial false value
  }

  public setUserDoNotDisplayLanguagePopup(userDoNotDisplay: boolean): void {
    // Update the value in the profile
    const userProfile = new UserProfile();
    userProfile.shouldSkipLanguagePopup = userDoNotDisplay;
    const sub = this.profile.updateProfile(userProfile).pipe(take(1)).subscribe();
    this.anchor.addNew(sub);

    // Update our cached value
    this.userDoNotDisplayObsSource.next(userDoNotDisplay);
  }

  public getShouldDisplayLanguagePopup(): Observable<boolean> {
    const studyDisplayObservable: Observable<boolean> = this.getStudyDisplayLanguagePopup();
    const userNotDisplayObservable: Observable<boolean> = this.getUserNotDisplayLanguagePopup();

    return zip(studyDisplayObservable, userNotDisplayObservable)
      .pipe(map(([displayForStudy, doNotDisplayForUser]) => displayForStudy && !doNotDisplayForUser));
  }

  ngOnDestroy(): void {
    if (this.anchor) {
      this.anchor.removeAll();
    }
  }
}
