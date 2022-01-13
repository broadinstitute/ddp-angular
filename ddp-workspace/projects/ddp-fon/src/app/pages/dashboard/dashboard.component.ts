import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivitiesUtil } from '../../utils';
import { Route } from '../../constants/Route';
import { forkJoin, Observable, of } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ActivityInstance,
  ActivityServiceAgent,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  isUIDisabled = false;
  activities: ActivityInstance[] | null = null;
  announcements: AnnouncementMessage[] | null = null;

  constructor(
    private router: Router,
    private activityService: ActivityServiceAgent,
    private userActivityService: UserActivityServiceAgent,
    private announcementsService: AnnouncementsServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onStartActivity({ instanceGuid }: ActivityInstance): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  onContinueActivity({ instanceGuid }: ActivityInstance): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  onViewActivity({ instanceGuid }: ActivityInstance): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  onUpdateActivity({ activityCode }: ActivityInstance): void {
    if (this.isUIDisabled) {
      return;
    }

    this.isUIDisabled = true;

    this.activityService
      .createInstance(this.config.studyGuid, activityCode)
      .pipe(take(1))
      .subscribe(({ instanceGuid }) => {
        this.isUIDisabled = false;
        this.router.navigate([Route.Activity, instanceGuid]);
      });
  }

  private loadData(): void {
    this.isLoading = true;

    forkJoin({
      activities: this.getActivities(),
      announcements: this.getAnnouncements(),
    }).subscribe(({ activities, announcements }) => {
      this.activities = ActivitiesUtil.sortActivitiesByStatus(activities);
      this.announcements = announcements;
      this.isLoading = false;
    });
  }

  private getActivities(): Observable<ActivityInstance[]> {
    return this.userActivityService.getActivities(of(this.config.studyGuid)).pipe(take(1));
  }

  private getAnnouncements(): Observable<AnnouncementMessage[]> {
    return this.announcementsService.getMessages(this.config.studyGuid).pipe(take(1));
  }
}
