import { DashboardComponent } from './dashboard.component';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { AnnouncementsServiceAgent } from 'ddp-sdk';

@Component({
    selector: 'toolkit-dashboard-redesigned',
    template: `
        <main class="main">
            <section class="section dashboard-title-section">
                <div class="content content_medium">
                    <h1 translate>Toolkit.Dashboard.Title</h1>
                </div>
            </section>
            <ng-container *ngFor="let announcement of announcementMessages; let i = index">
                <ng-container *ngIf="announcement.shown">
                    <section class="section">
                        <div class="content content_tight">
                            <div class="dashboard-content">
                                <div class="infobox infobox_dashboard">
                                    <button *ngIf="!announcement.permanent" mat-icon-button (click)="closeMessage(i)" class="close-button">
                                        <mat-icon class="close">clear</mat-icon>
                                    </button>
                                    <div [innerHTML]="announcement.message"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ng-container>
            </ng-container>
            <section class="section dashboard-section">
                <div class="content content_medium">
                    <div class="dashboard-content dashboard-content_table">
                        <ddp-user-activities [studyGuid]="studyGuid"
                                             (open)="navigate($event)">
                        </ddp-user-activities>
                    </div>
                </div>
            </section>
        </main>`
})
export class DashboardRedesignedComponent extends DashboardComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        router: Router,
        announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
        super(router, announcements, toolkitConfiguration);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
    }
}
