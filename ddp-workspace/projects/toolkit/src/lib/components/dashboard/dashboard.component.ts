import { Component, Inject, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { AnnouncementDashboardMessage } from '../../models/announcementDashboardMessage';
import {
    ActivityInstance,
    AnnouncementsServiceAgent, Participant,
    ParticipantsSearchServiceAgent,
    SearchParticipant,
    SessionMementoService,
    UserActivityServiceAgent
} from 'ddp-sdk';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {filter, map, mergeMap, shareReplay, take, tap} from 'rxjs/operators';

@Component({
    selector: 'toolkit-dashboard',
    template: `
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
            <ddp-subject-panel *ngIf="selectedUser$ | async as selectedUser" [subject]="selectedUser"></ddp-subject-panel>
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
                                               [activities]="userActivities$ | async"
                                               (open)="navigate($event)"
                                               (loadedEvent)="load($event)">
                                </ddp-dashboard>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>`
})
export class DashboardComponent implements OnInit, OnDestroy {
    public selectedUser$: Observable<SearchParticipant|null>;
    public studyGuid: string;
    public announcementMessages: Array<AnnouncementDashboardMessage>;
    public userActivities$: Observable<Array<ActivityInstance>>;
    @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    private anchor: Subscription = new Subscription();
    protected readonly LOG_SOURCE = 'DashboardComponent';

    constructor(
        protected router: Router,
        private announcements: AnnouncementsServiceAgent,
        private participantsSearch: ParticipantsSearchServiceAgent,
        protected session: SessionMementoService,
        protected userActivityServiceAgent: UserActivityServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
    }

    public ngOnInit(): void {
        if (this.useMultiParticipantDashboard) {
            // in order to prevent participant data call
            this.session.setParticipant(null);
        }
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
        this.userActivities$ = this.getUserActivities();
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public closeMessage(index: number): void {
        this.announcementMessages[index].shown = false;
    }

    public navigate(activityInstanceGuid: string, participantGuid?: string): void {
        if (this.useMultiParticipantDashboard && participantGuid) {
            this.session.setParticipant(participantGuid);
        }
        this.router.navigate([this.toolkitConfiguration.activityUrl, activityInstanceGuid]);
    }

    public load(loaded: boolean): void {
        this.loadedEvent.emit(loaded);
    }

    public get useMultiParticipantDashboard(): boolean {
        return this.toolkitConfiguration.useMultiParticipantDashboard;
    }

    private getUserActivities(): Observable<Array<ActivityInstance>> {
        // shareReplay treats multiple subscription w/o making multiple requests
        return this.userActivityServiceAgent.getActivities(of(this.studyGuid)).pipe(map((activities) => activities || []), shareReplay());
    }
}
