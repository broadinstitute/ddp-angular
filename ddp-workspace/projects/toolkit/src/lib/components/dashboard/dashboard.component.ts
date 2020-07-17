import { Component, Inject, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { AnnouncementDashboardMessage } from '../../models/announcementDashboardMessage';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'toolkit-dashboard',
    template: `
        <toolkit-header [showButtons]="false" *ngIf="!hideHeader">
        </toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout PageLayout-dashboard">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" translate>
                                Toolkit.Dashboard.Title
                            </h1>
                            <h2 class="PageHeader-text"
                                *ngIf="showText"
                                translate>Toolkit.Dashboard.Text</h2>
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
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>`
})
export class DashboardComponent implements OnInit, OnDestroy {

    @Input() public hideHeader = false;
    @Input() public showText = false;

    public studyGuid: string;
    public announcementMessages: Array<AnnouncementDashboardMessage>;
    private anchor: Subscription = new Subscription();

    constructor(
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
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
