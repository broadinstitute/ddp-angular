import { Component, Inject, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { AnnouncementDashboardMessage } from '../../models/announcementDashboardMessage';
import { AnnouncementsServiceAgent, ParticipantsSearchServiceAgent, SearchParticipant, SessionMementoService } from 'ddp-sdk';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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
    @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    private anchor: Subscription = new Subscription();

    constructor(
        protected router: Router,
        private announcements: AnnouncementsServiceAgent,
        private participantsSearch: ParticipantsSearchServiceAgent,
        protected session: SessionMementoService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
    }

    public ngOnInit(): void {
        if (this.useParticipantDashboard) {
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
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public closeMessage(index: number): void {
        this.announcementMessages[index].shown = false;
    }

    public navigate(id: string, participantGuid?: string): void {
        if (this.useParticipantDashboard) {
            this.session.setParticipant(participantGuid);
        }
        this.router.navigate([this.toolkitConfiguration.activityUrl, id]);
    }

    public load(loaded: boolean): void {
        this.loadedEvent.emit(loaded);
    }

    public get useParticipantDashboard(): boolean {
        return this.toolkitConfiguration.useParticipantDashboard;
    }
}
