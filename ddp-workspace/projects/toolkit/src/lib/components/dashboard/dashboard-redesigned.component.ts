import { DashboardComponent } from './dashboard.component';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import {
    AnnouncementsServiceAgent,
    SessionMementoService,
    UserInvitationServiceAgent,
    InvitationType,
    ParticipantsSearchServiceAgent,
    ConfigurationService,
    GovernedParticipantsServiceAgent,
    Participant, UserActivityServiceAgent, ActivityInstance
} from 'ddp-sdk';
import { map, take, filter } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
    selector: 'toolkit-dashboard-redesigned',
    template: `
        <main class="main">
            <section class="section">
                <ddp-subject-panel *ngIf="selectedUser$ | async as selectedUser" [subject]="selectedUser"></ddp-subject-panel>
            </section>
            <section class="section dashboard-title-section">
                <div class="content content_medium content_wide content_dashboard">
                    <div fxLayout="row">
                        <h1 class="dashboard-title-section__title" translate>
                            {{useParticipantDashboard ? 'Toolkit.Dashboard.ParticipantsTitle' : 'Toolkit.Dashboard.Title'}}
                        </h1>
                        <div *ngIf="useParticipantDashboard">
                            <button mat-stroked-button class="add-participant-button">
                                {{'Toolkit.Dashboard.AddParticipant' | translate}}
                            </button>
                        </div>
                    </div>
                    <p *ngIf="invitationId" class="invitation-code">
                        <span class="invitation-code__text" translate>Toolkit.Dashboard.Invitation.InvitationCode</span>
                        <span>{{invitationId | invitation}}</span>
                    </p>
                </div>
            </section>
            <section *ngIf="isAdmin && !subjectInfoExists; else dashboard" class="section">
                <div class="content content_medium">
                    <div class="dashboard-message">
                        <p class="dashboard-message__text" translate>Toolkit.Dashboard.Invitation.Message</p>
                        <a class="button button_primary" [routerLink]="'/' + toolkitConfig.adminDashboardUrl" translate>
                            Toolkit.Dashboard.Invitation.Button
                        </a>
                    </div>
                </div>
            </section>
            <ng-template #dashboard>
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
                <section class="section dashboard-section" [class.full-width]="useParticipantDashboard">
                    <div class="content content_medium">
                        <mat-accordion *ngIf="useParticipantDashboard; else activitiesTable" hideToggle>
                            <mat-expansion-panel *ngFor="let participant of governedParticipants$ | async; first as isFirst"
                                                 [expanded]="isFirst"
                                                 (opened)="openParticipantPanel(participant.userGuid);"
                                                 (closed)="closeParticipantPanel(participant.userGuid);">
                                <mat-expansion-panel-header>
                                    <mat-panel-title>
                                        {{participant.userProfile.firstName}} {{participant.userProfile.lastName}}
                                    </mat-panel-title>
                                    <mat-panel-description fxLayoutAlign="end center">
                                        <ng-container *ngIf="panelsState.get(participant.userGuid); else show">
                                            {{'Toolkit.Dashboard.HidePanel' | translate}}
                                            <mat-icon>expand_less</mat-icon>
                                        </ng-container>
                                        <ng-template #show>
                                            {{'Toolkit.Dashboard.ShowPanel' | translate}}
                                            <mat-icon>expand_more</mat-icon>
                                        </ng-template>
                                    </mat-panel-description>
                                </mat-expansion-panel-header>
                                <ng-template matExpansionPanelContent>
                                    <ng-container *ngTemplateOutlet="activitiesTable; context: {$implicit: participant.userGuid }"></ng-container>
                                </ng-template>
                            </mat-expansion-panel>
                        </mat-accordion>
                        <ng-template #activitiesTable let-participantGuid>
                            <div class="dashboard-content dashboard-content_table">
                                <ddp-user-activities [studyGuid]="studyGuid"
                                                     [displayedColumns]="toolkitConfig.dashboardDisplayedColumns"
                                                     [participantGuid]="participantGuid"
                                                     (open)="navigate($event, participantGuid)">
                                </ddp-user-activities>
                            </div>
                        </ng-template>
                    </div>
                </section>
            </ng-template>
        </main>`,
    styles: [`
        .full-width {
            width: 100%;
        }
    `]
})
export class DashboardRedesignedComponent extends DashboardComponent implements OnInit {
    public invitationId: string | null = null;
    public governedParticipants$: Observable<Participant[]>;
    public panelsState = new Map<string, boolean>();

    constructor(
        private headerConfig: HeaderConfigurationService,
        protected session: SessionMementoService,
        private _router: Router,
        private _announcements: AnnouncementsServiceAgent,
        private userInvitation: UserInvitationServiceAgent,
        _participantsSearch: ParticipantsSearchServiceAgent,
        private governedParticipantsAgent: GovernedParticipantsServiceAgent,
        private userActivityServiceAgent: UserActivityServiceAgent,
        @Inject('ddp.config') private config: ConfigurationService,
        @Inject('toolkit.toolkitConfig') public toolkitConfig: ToolkitConfigurationService) {
        super(_router, _announcements, _participantsSearch, session, toolkitConfig);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
        !this.isAdmin && this.getInvitationId();

        this.governedParticipants$ = forkJoin({
            userActivities: this.getOperatorActivities(),
            participants: this.governedParticipantsAgent.getGovernedStudyParticipants(this.config.studyGuid)
        }).pipe(map(({ userActivities, participants }) => {
            return [...(userActivities ? [] : []), ...participants];
        }));
    }

    private getOperatorActivities(): Observable<Array<ActivityInstance> | null> {
        this.session.setParticipant(this.session.session.userGuid);
        return this.userActivityServiceAgent.getActivities(of(this.config.studyGuid));
        // return of(null);
    }

    public get isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public get subjectInfoExists(): boolean {
        return !!this.session.session.participantGuid;
    }

    public openParticipantPanel(userGuid: string): void {
        this.panelsState.set(userGuid, true);
    }

    public closeParticipantPanel(userGuid: string): void {
        this.panelsState.set(userGuid, false);
    }

    private getInvitationId(): void {
        this.userInvitation.getInvitations().pipe(
            take(1),
            filter(invitations => !!invitations),
            map(invitations => invitations.find(invitation => {
                return invitation.invitationType === InvitationType.RECRUITMENT;
            })),
            filter(invitation => !!invitation)
        ).subscribe(invitation => this.invitationId = invitation.invitationId);
    }
}
