import { DashboardComponent } from './dashboard.component';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import {
    AnnouncementsServiceAgent,
    SessionMementoService,
    UserInvitationServiceAgent,
    InvitationType,
    ParticipantsSearchServiceAgent,
    GovernedParticipantsServiceAgent,
    UserActivityServiceAgent,
    ActivityInstance,
    UserProfileServiceAgent,
    WorkflowServiceAgent,
    UserManagementServiceAgent
} from 'ddp-sdk';
import { map, take, filter, switchMap, tap, mergeMap, finalize, catchError } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

interface DashboardParticipant {
    userGuid: string;
    label: string;
    activities: ActivityInstance[];
}

@Component({
    selector: 'toolkit-dashboard-redesigned',
    template: `
        <main class="main">
            <section class="section">
                <ddp-subject-panel *ngIf="selectedUser$ | async as selectedUser" [subject]="selectedUser"></ddp-subject-panel>
            </section>
            <section class="section dashboard-title-section">
                <div class="content content_medium content_wide content_dashboard">
                    <div fxLayout="row" fxLayoutAlign="space-between center">
                        <h1 class="dashboard-title-section__title" fxLayoutAlign="center center">
                            <ng-container *ngIf="useMultiParticipantDashboard; else regularDashboard">
                                <mat-icon>perm_identity</mat-icon>
                                <span translate>Toolkit.Dashboard.ParticipantsTitle</span>
                            </ng-container>
                            <ng-template #regularDashboard><span translate>Toolkit.Dashboard.Title</span></ng-template>
                        </h1>
                        <div *ngIf="toolkitConfig.useMultiParticipantDashboard">
                            <button mat-stroked-button
                                    class="add-participant-button button_small"
                                    [disabled]="addParticipantButtonDisabled"
                                    (click)="addParticipant()">
                                <mat-icon>add</mat-icon>
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
                <section class="section dashboard-section" [class.full-width]="useMultiParticipantDashboard">
                    <div class="content content_medium">
                        <mat-accordion *ngIf="useMultiParticipantDashboard; else activitiesTable" hideToggle multi>
                            <mat-expansion-panel *ngFor="let participant of dashboardParticipants$ | async; first as isFirst; trackBy: trackById"
                                                 class="dashboard-panel"
                                                 [expanded]="isFirst"
                                                 (opened)="openParticipantPanel(participant.userGuid);"
                                                 (closed)="closeParticipantPanel(participant.userGuid);">
                                <mat-expansion-panel-header class="dashboard-panel-header">
                                    <mat-panel-title class="dashboard-panel-title">
                                        {{participant.label}}
                                    </mat-panel-title>
                                    <mat-panel-description fxLayoutAlign="end center" class="dashboard-panel-description">
                                        <ng-container *ngIf="participantUserGuidToPanelIsOpen.get(participant.userGuid); else show">
                                            {{'Toolkit.Dashboard.HidePanel' | translate}}
                                            <mat-icon>expand_less</mat-icon>
                                        </ng-container>
                                        <ng-template #show>
                                            {{'Toolkit.Dashboard.ShowPanel' | translate}}
                                            <mat-icon>expand_more</mat-icon>
                                        </ng-template>
                                    </mat-panel-description>
                                </mat-expansion-panel-header>
                                <ng-container *ngTemplateOutlet="activitiesTable; context: {
                                    participantGuid: participant.userGuid,
                                    activities: participant.activities }">
                                </ng-container>
                            </mat-expansion-panel>
                        </mat-accordion>
                        <ng-template #activitiesTable let-participantGuid="participantGuid" let-activities="activities">
                            <div class="dashboard-content dashboard-content_table">
                                <ddp-user-activities [studyGuid]="studyGuid"
                                                     [displayedColumns]="toolkitConfig.dashboardDisplayedColumns"
                                                     [dataSource]="activities || (userActivities$ | async)"
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
export class DashboardRedesignedComponent extends DashboardComponent implements OnInit, OnDestroy {
    public invitationId: string | null = null;
    public dashboardParticipants$: Observable<DashboardParticipant[]>;
    public participantUserGuidToPanelIsOpen = new Map<string, boolean>();
    public addParticipantButtonDisabled = false;
    private ngUnsubscribe = new Subject();

    constructor(
        private headerConfig: HeaderConfigurationService,
        protected session: SessionMementoService,
        protected router: Router,
        private _announcements: AnnouncementsServiceAgent,
        private userInvitation: UserInvitationServiceAgent,
        _participantsSearch: ParticipantsSearchServiceAgent,
        private governedParticipantsAgent: GovernedParticipantsServiceAgent,
        protected userActivityServiceAgent: UserActivityServiceAgent,
        private userProfileService: UserProfileServiceAgent,
        private translate: TranslateService,
        private workflowService: WorkflowServiceAgent,
        private userManagementService: UserManagementServiceAgent,
        @Inject('toolkit.toolkitConfig') public toolkitConfig: ToolkitConfigurationService) {
        super(router, _announcements, _participantsSearch, session, userActivityServiceAgent, toolkitConfig);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
        !this.isAdmin && this.getInvitationId();

        this.dashboardParticipants$ = this.useMultiParticipantDashboard ? this.getDashboardParticipants() : of([]);
    }

    private getDashboardParticipants(): Observable<DashboardParticipant[]> {
        const operatorParticipant$ = this.userActivities$
            .pipe(switchMap((userActivities) => userActivities.length ? this.userProfileService.profile : of(null)));

        return combineLatest([
            operatorParticipant$,
            this.governedParticipantsAgent.getGovernedStudyParticipants(this.studyGuid),
        ]).pipe(
            map(([operatorParticipant, participants]) => {
                const result: Observable<DashboardParticipant>[] =
                    participants.map((participant, i) => this.getUserActivitiesForParticipant(participant.userGuid)
                    .pipe(take(1), map((activities) => ({
                        userGuid: participant.userGuid,
                        label: (participant.userProfile.firstName || participant.userProfile.lastName)
                            ? `${participant.userProfile.firstName} ${participant.userProfile.lastName}`
                            : this.translate.instant('Toolkit.Dashboard.ChildLabel', { suffix: i > 0 ? ' #' + (i + 1) : '' }),
                        activities,
                }))));
                if (operatorParticipant) {
                    result.unshift(this.userActivities$.pipe(take(1), map((activities) => ({
                        userGuid: this.session.session.userGuid,
                        label: (operatorParticipant.profile.firstName || operatorParticipant.profile.lastName)
                            ? `${operatorParticipant.profile.firstName} ${operatorParticipant.profile.lastName}`
                            : this.translate.instant('Toolkit.Dashboard.UserLabel'),
                        activities
                    }))));
                }
                return result;
            }),
            switchMap(participants$ => forkJoin(...participants$)),
            switchMap(participants => this.checkAndDeleteAccidentalParticipant(participants)),
        );
    }

    public get isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public get subjectInfoExists(): boolean {
        return !!this.session.session.participantGuid;
    }

    public openParticipantPanel(userGuid: string): void {
        this.participantUserGuidToPanelIsOpen.set(userGuid, true);
    }

    public closeParticipantPanel(userGuid: string): void {
        this.participantUserGuidToPanelIsOpen.set(userGuid, false);
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

    public addParticipant(): void {
        this.addParticipantButtonDisabled = true;
        this.governedParticipantsAgent.addParticipant(this.studyGuid)
            .pipe(
                take(1),
                tap(userGuid => this.session.setParticipant(userGuid)),
                mergeMap((userGuid) => this.workflowService.fromParticipantList()
                    .pipe(catchError(() => this.userManagementService.deleteUser(userGuid)))),
                finalize(() => this.addParticipantButtonDisabled = false)
            )
            .subscribe((response) => {
                if (response && response.instanceGuid) {
                    this.navigate(response.instanceGuid);
                }
            });
    }

    private checkAndDeleteAccidentalParticipant(participants: DashboardParticipant[]): Observable<DashboardParticipant[]> {
        const accidentalParticipant = participants.filter(({activities}) => !activities.length);

        if (!accidentalParticipant.length) {
            return of(participants);
        }

        const deleteUserObservableList: Observable<void>[] = accidentalParticipant
            .map((participant) => this.userManagementService.deleteUser(participant.userGuid));
        return forkJoin(...deleteUserObservableList)
            // return filtered participants once all deleting requests were done
            .pipe(map(() => participants.filter(({activities}) => activities.length)));
    }

    public getUserActivitiesForParticipant(participantGuid: string): Observable<Array<ActivityInstance>> {
        return of(participantGuid).pipe(
            switchMap(() => this.userActivityServiceAgent.getActivities(of(this.studyGuid), participantGuid)),
            map((activities) => activities || []));
    }

    public trackById(_, participant: DashboardParticipant): string {
        return participant.userGuid;
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
