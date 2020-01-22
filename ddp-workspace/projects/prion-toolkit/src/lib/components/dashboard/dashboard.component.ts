import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";

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
                        <section *ngIf="announcementsText && showMessage" class="PageContent-section Dashboard-info-section">
                            <mat-icon (click)="closeMessage()" class="close">clear</mat-icon>
                            <div class="Announcements-section" [innerHTML]="announcementsText">
                            </div>
                        </section>
                        <section class="PageContent-section">
                            <ddp-dashboard [studyGuid]="studyGuid"
                                           (open)="navigate($event)">
                            </ddp-dashboard>
                            <div>
                              <mat-table #table [dataSource]="dataSource" data-ddp-test="staticActivitiesTable" class="ddp-dashboard ddp-dashboard-static">
                                <!-- Activity Column -->
                                <ng-container matColumnDef="name">
                                  <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></mat-header-cell>
                                  <mat-cell *matCellDef="let element" class="padding-5">
                                    <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
                                    <button class="dashboard-activity-button Link"
                                            [attr.data-ddp-test]="'activityName::' + element.name"
                                            (click)="navigate(element.url)">
                                      {{ element.name }}
                                    </button>
                                  </mat-cell>
                                </ng-container>
                                <!-- Status Column -->
                                <ng-container matColumnDef="summary">
                                  <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.Summary' | translate">TODO</mat-header-cell>
                                  <mat-cell *matCellDef="let element" class="padding-5"
                                            [attr.data-ddp-test]="'activityName::' + element.status">
                                    <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
                                    {{ element.status }}
                                  </mat-cell>
                                </ng-container>
                                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
                            </mat-table>
                          </div>
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
    public announcementsText: string | null;
    public showMessage = true;
    private anchor: Subscription;
    public dataSource: Observable<string>;
    public displayedColumns = ['name', 'summary'];

    constructor(
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        public translator: TranslateService) {
        this.anchor = new Subscription();
    }

    public ngOnInit(): void {
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        const anno = this.announcements.getMessage(this.studyGuid).subscribe(x => {
            if (x !== null && x.length) {
                this.announcementsText = x[0].message;
            }
        });
        this.anchor.add(anno);
        this.dataSource = this.translator.get(['Toolkit.Dashboard.StudyListing.ActivityName',
        'Toolkit.Dashboard.StudyListing.ActivityStatus', 'study-listing']);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public closeMessage(): void {
        this.showMessage = false;
    }

    public navigate(url: string): void {
        this.router.navigateByUrl(url);
    }
}
