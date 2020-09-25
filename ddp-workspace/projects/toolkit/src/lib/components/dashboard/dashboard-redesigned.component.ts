import { DashboardComponent } from './dashboard.component';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { AnnouncementsServiceAgent, SessionMementoService, UserInvitationServiceAgent, InvitationType } from 'ddp-sdk';
import { map, take, filter } from 'rxjs/operators';

@Component({
    selector: 'toolkit-dashboard-redesigned',
    template: `
        <main class="main">
            <section class="section">
                <ddp-subject-panel></ddp-subject-panel>
            </section>
            <section class="section dashboard-title-section">
                <div class="content content_medium content_wide content_dashboard">
                    <h1 class="dashboard-title-section__title" translate>
                        Toolkit.Dashboard.Title
                    </h1>
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
                        <a class="button button_primary" [routerLink]="'/' + config.adminDashboardUrl" translate>
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
                <section class="section dashboard-section">
                    <div class="content content_medium">
                        <div class="dashboard-content dashboard-content_table">
                            <ddp-user-activities [studyGuid]="studyGuid"
                                                 [displayedColumns]="config.dashboardDisplayedColumns"
                                                 (open)="navigate($event)">
                            </ddp-user-activities>
                        </div>
                    </div>
                </section>
            </ng-template>
        </main>`
})
export class DashboardRedesignedComponent extends DashboardComponent implements OnInit {
    public invitationId: string | null = null;

    constructor(
        private headerConfig: HeaderConfigurationService,
        private session: SessionMementoService,
        private _router: Router,
        private _announcements: AnnouncementsServiceAgent,
        private userInvitation: UserInvitationServiceAgent,
        @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
        super(_router, _announcements, config);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
        !this.isAdmin && this.getInvitationId();
    }

    public get isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public get subjectInfoExists(): boolean {
        return !!this.session.session.participantGuid && !!this.session.session.invitationId;
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
