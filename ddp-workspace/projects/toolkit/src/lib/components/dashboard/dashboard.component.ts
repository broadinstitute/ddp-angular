import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { AnnouncementMessage } from './../../models/announcementMessage';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'toolkit-dashboard',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

    <ng-template #newDesign>
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
                                    <button mat-icon-button (click)="closeMessage(i)" class="close-button">
                                        <mat-icon class="close">clear</mat-icon>
                                    </button>
                                    <div [innerHTML]="announcement.message"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ng-container>
            </ng-container>
            <section class="section">
                <div class="content content_medium">
                    <div class="dashboard-content dashboard-content_table">
                        <ddp-user-activities [studyGuid]="studyGuid"
                                             (open)="navigate($event)">
                        </ddp-user-activities>
                    </div>
                </div>
            </section>
        </main>
    </ng-template>

    <ng-template #oldDesign>
        <toolkit-header [showButtons]="false">
        </toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout PageLayout-dashboard">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" translate>
                                Toolkit.Dashboard.Title
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <article class="PageContent">
                <div class="PageLayout PageLayout-dashboard">
                    <div class="row NoMargin">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <ng-container *ngFor="let announcement of announcementMessages; let i = index">
                                <ng-container *ngIf="announcement.shown">
                                    <section class="PageContent-section Dashboard-info-section">
                                        <button mat-icon-button (click)="closeMessage(i)" class="close-button">
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
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </ng-template>`
})
export class DashboardComponent implements OnInit, OnDestroy {
    public studyGuid: string;
    public useRedesign: boolean;
    public announcementMessages: Array<AnnouncementMessage>;
    private anchor: Subscription;

    constructor(
        private headerConfig: HeaderConfigurationService,
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        this.anchor = new Subscription();
    }

    public ngOnInit(): void {
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        const anno = this.announcements.getMessage(this.studyGuid)
            .pipe(
                filter(x => x !== null && x.length !== 0),
                map(messages => messages.map(message => ({
                    ...message,
                    shown: true
                })))
            ).subscribe(messages => this.announcementMessages = messages);
        this.anchor.add(anno);
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupDefaultHeader();
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
}
