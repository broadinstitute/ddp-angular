import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
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
export class DashboardComponent implements OnInit {
  loading = true;
  activities: ActivityInstance[] = [];

  constructor(
    private router: Router,
    private userActivityService: UserActivityServiceAgent,
    private announcementsService: AnnouncementsServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private sleepLogService: SleepLogService,
  ) {}

  ngOnInit(): void {
    this.fetchData()
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
