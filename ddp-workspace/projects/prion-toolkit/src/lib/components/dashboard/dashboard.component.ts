import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { Subscription } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import { StaticActivitiesDataSource } from "./staticActivitiesDataSource";
import { AnnouncementDashboardMessage } from "../../../../../toolkit/src/lib/models/announcementDashboardMessage";
import { filter, map } from "rxjs/operators";

@Component({
    selector: 'toolkit-dashboard',
    template: `
    <toolkit-header>
    </toolkit-header>
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
                              <mat-table #table [dataSource]="dataSource" data-ddp-test="staticActivitiesTable" class="ddp-dashboard ddp-dashboard-static">
                                <!-- Activity Column -->
                                <ng-container matColumnDef="name">
                                  <mat-header-cell *matHeaderCellDef></mat-header-cell>
                                  <mat-cell *matCellDef="let element" class="padding-5">
                                    <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
                                    <button class="dashboard-activity-button Link"
                                            [attr.data-ddp-test]="'activityName::' + element.name"
                                            (click)="navigateTo()">{{ element.name }}</button>
                                  </mat-cell>
                                </ng-container>
                                <!-- Status Column -->
                                <ng-container matColumnDef="summary">
                                  <mat-header-cell *matHeaderCellDef></mat-header-cell>
                                  <mat-cell *matCellDef="let element" class="padding-5"
                                            [attr.data-ddp-test]="'activityName::' + element.summary">
                                    <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
                                    {{ element.summary }}
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
export class DashboardComponent implements OnInit, OnDestroy {
    public studyGuid: string;
    public welcomeText: string;
    public announcementMessages: Array<AnnouncementDashboardMessage>;
    private anchor: Subscription;
    public dataSource: StaticActivitiesDataSource;
    public displayedColumns = ['name', 'summary'];

    constructor(
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        public translator: TranslateService
    ) {
        this.anchor = new Subscription();
    }

    public ngOnInit(): void {
        this.dataSource = new StaticActivitiesDataSource(this.translator);
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
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

  public closeMessage(index: number): void {
    this.announcementMessages[index].shown = false;
  }


    //TODO: Clean up this code so that it either is or is not flexible in terms of adding additional static activities
    public navigate(id: string): void {
      this.router.navigate([this.toolkitConfiguration.activityUrl, id]);
    }

    public navigateTo(): void {
        this.router.navigateByUrl('study-listing');
    }
}
