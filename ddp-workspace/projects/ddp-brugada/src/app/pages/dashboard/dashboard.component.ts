import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ActivityInstance,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  activities: ActivityInstance[] | null = null;
  announcements: AnnouncementMessage[] | null = null;

  constructor(
    private router: Router,
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

  onUpdateActivity({ instanceGuid }: ActivityInstance): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  private loadData(): void {
    this.isLoading = true;

    forkJoin({
      activities: this.getActivities(),
      announcements: this.getAnnouncements(),
    }).subscribe(({ activities, announcements }) => {
      this.activities = activities;
      this.announcements = announcements;
      this.isLoading = false;
    });
  }

  private getActivities(): Observable<ActivityInstance[]> {
    return this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(take(1));
  }

  private getAnnouncements(): Observable<AnnouncementMessage[]> {
    return this.announcementsService
      .getMessages(this.config.studyGuid)
      .pipe(take(1));
  }
}
