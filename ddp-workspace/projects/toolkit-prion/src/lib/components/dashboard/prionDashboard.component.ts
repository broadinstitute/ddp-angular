import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { TranslateService } from "@ngx-translate/core";
import { DashboardComponent, ToolkitConfigurationService } from "toolkit";

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
    readOnly: 'notApplicable',
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
                  <ddp-dashboard [studyGuid]="studyGuid"
                                 (open)="navigate($event)">
                  </ddp-dashboard>
                  <mat-table #table [dataSource]="dataSource" data-ddp-test="staticActivitiesTable" class="ddp-dashboard ddp-dashboard-static dataTable">
                    <!-- Activity Column -->
                    <ng-container matColumnDef="name">
                      <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></mat-header-cell>
                      <mat-cell *matCellDef="let element" class="padding-5">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
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
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
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
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityDate' | translate"></span>
                        <div class="dashboard-status-container" translate>
                          {{element.created}}
                        </div>
                      </mat-cell>
                    </ng-container>
                    <!-- Status Column -->
                    <ng-container matColumnDef="status">
                      <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.Status' | translate"></mat-header-cell>
                      <mat-cell *matCellDef="let element"
                                class="padding-5"
                                [attr.data-ddp-test]="'activityStatus::' + 
                                          translator.get(element.status)">
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate"></span>
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
                        <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></span>
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
export class PrionDashboardComponent extends DashboardComponent implements OnInit, OnDestroy {
  public dataSource = STATIC_ACTIVITIES;
  public displayedColumns = ['name', 'summary', 'created', 'status', 'actions'];

  constructor(
        private _router: Router,
        private _announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService,
        public translator: TranslateService) {
        super(_router, _announcements, _toolkitConfiguration);
    }

    public ngOnInit(): void {
      super.ngOnInit();
    }

    public ngOnDestroy(): void {
      super.ngOnDestroy();
    }

  public navigateToUrl(url: string): void {
    this._router.navigateByUrl(url);
  }
}
