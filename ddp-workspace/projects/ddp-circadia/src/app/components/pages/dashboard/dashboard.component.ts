import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  CompositeDisposable,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { Route } from '../../../constants/route';
import { ActivityCode } from '../../../constants/activity-code';
import { SleepLogService } from '../../../services/sleep-log.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  activities: ActivityInstance[] = [];
  private subs = new CompositeDisposable();

  constructor(
    private router: Router,
    private userActivityService: UserActivityServiceAgent,
    private announcementsService: AnnouncementsServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private sleepLogService: SleepLogService,
  ) {}

  ngOnInit(): void {
    const sub = this.fetchData()
      .pipe(
        map(({ activities, announcements }) => ({
          activities,
          sleepLogCodes:
            this.sleepLogService.extractSleepLogAnnouncements(announcements),
        })),
        concatMap(({ activities, sleepLogCodes }) =>
          this.sleepLogService.runSleepLogActions(
            sleepLogCodes,
            !!activities.find(
              activity => activity.activityCode === ActivityCode.MiniSleepLog,
            ),
          ),
        ),
      )
      .subscribe();

    this.subs.addNew(sub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  onStartActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onContinueActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onViewActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  get diaryUrl(): string | null {
    return this.sleepLogService.diaryUrl$.getValue();
  }

  get diaryStatus(): string | null {
    return this.sleepLogService.diaryStatus$.getValue();
  }

  get diaryStatusError(): boolean | null {
    return this.sleepLogService.diaryStatusError$.getValue();
  }

  get diaryUrlError(): boolean | null {
    return this.sleepLogService.diaryUrlError$.getValue();
  }

  private fetchData(): Observable<{
    activities: ActivityInstance[];
    announcements: AnnouncementMessage[];
  }> {
    this.loading = true;

    return forkJoin({
      activities: this.fetchActivities(),
      announcements: this.fetchAnnouncements(),
    }).pipe(
      tap(() => {
        this.loading = false;
      }),
    );
  }

  private fetchActivities(): Observable<ActivityInstance[]> {
    return this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(
        take(1),
        tap(activities => {
          this.activities = activities;
        }),
      );
  }

  private fetchAnnouncements(): Observable<AnnouncementMessage[]> {
    return this.announcementsService
      .getMessages(this.config.studyGuid)
      .pipe(take(1));
  }
}
