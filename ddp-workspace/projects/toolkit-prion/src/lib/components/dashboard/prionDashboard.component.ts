import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AnnouncementsServiceAgent, ParticipantsSearchServiceAgent, SearchParticipant } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DashboardAnnouncement } from '../../models/dashboardAnnouncement';

export interface StaticActivity {
  name: string;
  status: string;
  created: string;
  summary: string;
  actions: string;
  readOnly: string;
  url: string;
}

const STATIC_ACTIVITIES: StaticActivity[] = [
  {name: 'Toolkit.Dashboard.StudyListing.ActivityName',
    status: 'Toolkit.Dashboard.StudyListing.ActivityStatus',
    created: 'Toolkit.Dashboard.StudyListing.ActivityCreated',
    summary: 'Toolkit.Dashboard.StudyListing.ActivitySummary',
    actions: 'Toolkit.Dashboard.StudyListing.ActivityActions',
    readOnly: 'true',
    url: 'study-listing'}
];

@Component({
    selector: 'prion-dashboard',
    template: `
      <prion-header currentRoute="/dashboard">
      </prion-header>
      <div class="Wrapper">
        <article class="PageContent">
          <div class="PageLayout PageLayout-dashboard">
            <div class="row NoMargin">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ng-container *ngFor="let announcement of announcementMessages; let i = index">
                  <ng-container *ngIf="announcement.shown">
                    <section class="PageContent-section Dashboard-info-section">
                      <button *ngIf="!announcement.permanent" mat-icon-button (click)="closeMessage(i)" class="close-button">
                        <mat-icon class="close">clear</mat-icon>
                      </button>
                      <div class="Announcements-section" [innerHTML]="announcement.message">
                      </div>
                    </section>
                  </ng-container>
                </ng-container>
                <section class="PageContent-section">
                  <h2 class="PageContent-subtitle PageContent-subtitle-dashboard" translate>
                    SDK.Dashboard.Title
                  </h2>
                  <p class="PageContent-text PageContent-text-dashboard" translate>
                    SDK.Dashboard.Text
                  </p>
                  <prion-user-activities [studyGuid]="studyGuid"
                                        (open)="navigate($event)"
                                        (loadedEvent)="load($event)">
                  </prion-user-activities>
                  <mat-table [dataSource]="dataSource" data-ddp-test="staticActivitiesTable"
                             class="ddp-dashboard ddp-dashboard-static dataTable">
                    <!-- Activity Column -->
                    <ng-container matColumnDef="name">
                      <mat-header-cell *matHeaderCellDef
                                       [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></mat-header-cell>
                      <mat-cell *matCellDef="let element" class="padding-5">
                        <span class="dashboard-mobile-label"
                              [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
                        <button class="dashboard-activity-button Link"
                                [attr.data-ddp-test]="'activityName::' + translator.instant(element.name)"
                                (click)="navigateToUrl(element.url)" translate>{{ element.name }}</button>
                      </mat-cell>
                    </ng-container>
                    <!-- Summary Column -->
                    <ng-container matColumnDef="summary">
                      <mat-header-cell *matHeaderCellDef></mat-header-cell>
                      <mat-cell *matCellDef="let element"
                                class="padding-5"
                                [attr.data-ddp-test]="'activitySummary::' +
                                          translator.instant(element.summary)">
                        <span class="dashboard-mobile-label"
                              [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
                        <div class="dashboard-status-container" translate>
                          {{element.summary}}
                        </div>
                      </mat-cell>
                    </ng-container>
                    <!-- Created Column -->
                    <ng-container matColumnDef="created">
                      <mat-header-cell *matHeaderCellDef></mat-header-cell>
                      <mat-cell *matCellDef="let element"
                                class="padding-5"
                                [attr.data-ddp-test]="'activityCreated::' +
                                          translator.instant(element.created)">
                        <span class="dashboard-mobile-label"
                              [innerHTML]="'SDK.UserActivities.ActivityDate' | translate"></span>
                        <div class="dashboard-status-container" translate>
                          {{element.created}}
                        </div>
                      </mat-cell>
                    </ng-container>
                    <!-- Status Column -->
                    <ng-container matColumnDef="status">
                      <mat-header-cell *matHeaderCellDef
                                       [innerHTML]="'SDK.UserActivities.Status' | translate"></mat-header-cell>
                      <mat-cell *matCellDef="let element"
                                class="padding-5"
                                [attr.data-ddp-test]="'activityStatus::' +
                                          translator.get(element.status)">
                        <span class="dashboard-mobile-label"
                              [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate"></span>
                        <div class="dashboard-status-container" translate>
                          {{element.status}}
                        </div>
                      </mat-cell>
                    </ng-container>
                    <!-- Actions Column -->
                    <ng-container matColumnDef="actions">
                      <mat-header-cell *matHeaderCellDef></mat-header-cell>
                      <mat-cell *matCellDef="let element"
                                [attr.data-ddp-test]="'activityActions::' + element.readOnly">
                        <span class="dashboard-mobile-label"
                              [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></span>
                        <button class="ButtonFilled Button--cell button button_small button_primary"
                                (click)="navigateToUrl(element.url)" translate>{{ element.actions }}</button>
                      </mat-cell>
                    </ng-container>
                    <mat-header-row *matHeaderRowDef="displayedColumns" class="DisplayNone"></mat-header-row>
                    <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
                  </mat-table>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>`
})
export class PrionDashboardComponent implements OnInit, OnDestroy {
  public dataSource = STATIC_ACTIVITIES;
  public displayedColumns = ['name', 'summary', 'created', 'status', 'actions'];
  public selectedUser$: Observable<SearchParticipant|null>;
  public studyGuid: string;
  public announcementMessages: Array<DashboardAnnouncement>;
  @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private anchor: Subscription = new Subscription();

  constructor(
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        private participantsSearch: ParticipantsSearchServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        public translator: TranslateService) {
  }

  public ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;

    const anno = this.announcements.getMessages(this.studyGuid)
        .pipe(
            filter(messages => !!messages),
            map(messages => messages.map(message => ({
              ...message,
              shown: true
            })))
        ).subscribe(messages => this.announcementMessages = messages);
    this.anchor.add(anno);

    this.selectedUser$ = this.participantsSearch.getParticipant();
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public closeMessage(index: number): void {
    this.announcementMessages[index].shown = false;
  }

  public navigate(id: string): void {
    this.router.navigate([this.toolkitConfiguration.activityUrl, id]);
  }

  public navigateToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  public load(loaded: boolean): void {
    this.loadedEvent.emit(loaded);
  }
}
