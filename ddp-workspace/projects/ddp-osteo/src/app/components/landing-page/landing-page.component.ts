import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { Router } from '@angular/router';
import {
    Auth0AdapterService,
    ConfigurationService,
    GovernedParticipantsServiceAgent,
    LoggingService,
    Participant,
    SessionMementoService,
    WorkflowServiceAgent,
} from 'ddp-sdk';
import {
    filter,
    finalize,
    mergeMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { iif, Observable, of } from 'rxjs';
import { GovernedUserService } from '../../services/governed-user.service';

@Component({
    selector: 'app-landing-page',
    template: `
        <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
    `,
})
export class LandingPageComponent implements OnInit {
    private operatorUserTemp: string;
    private readonly LOG_SOURCE = 'LoginLandingComponent';

    private readonly SELF_DIAGNOSED = 'DIAGNOSED';
    private readonly CHILD_DIAGNOSED = 'CHILD_DIAGNOSED';
    private answers: [];

    constructor(
        private router: Router,
        private logger: LoggingService,
        private auth0: Auth0AdapterService,
        private sessionService: SessionMementoService,
        private participantService: GovernedParticipantsServiceAgent,
        private workflowService: WorkflowServiceAgent,
        private workflowBuilder: WorkflowBuilderService,
        @Inject('ddp.config') private config: ConfigurationService,
        @Inject('toolkit.toolkitConfig')
        private toolkitConfiguration: ToolkitConfigurationService,
        private governedUserService: GovernedUserService,
        private governedParticipantsAgent: GovernedParticipantsServiceAgent
    ) {}

    ngOnInit(): void {
        if (!this.config.doLocalRegistration && location.hash) {
            this.auth0.handleAuthentication(this.handleAuthError.bind(this));
        }

        this.load().subscribe();
    }

    protected handleAuthError(error: any | null): void {
        if (error) {
            this.logger.logError(this.LOG_SOURCE, error);
        }
        this.router.navigateByUrl(this.toolkitConfiguration.errorUrl);
    }

    private load(): Observable<any> {
        return this.governedUserService.checkIfGoverned.pipe(
            tap((answers) => {
                this.answers = answers;
            }),
            filter((answers) => !!answers),
            mergeMap(() => this.loadParticipants()),
            mergeMap((participants) =>
                iif(
                    () =>
                        !participants.length &&
                        this.answers.find(
                            ({ stableId }) => stableId === this.CHILD_DIAGNOSED
                        ),
                    this.governedParticipantsAgent.addParticipant(
                        this.config.studyGuid
                    ),
                    of(false)
                )
            ),
            filter((addedParticipant) => !!addedParticipant),
            tap((governedParticipant: any) => {
                this.operatorUserTemp = this.sessionService.session.userGuid;
                this.sessionService.setParticipant(governedParticipant);
            }),
            mergeMap(() => this.workflowService.fromParticipantList()),
            tap(() => {
                const parent = this.answers.find(
                    (participant: any) =>
                        participant.stableId === this.SELF_DIAGNOSED
                );
                parent &&
                    this.sessionService.setParticipant(this.operatorUserTemp);
            }),
            take(1),
            finalize(() => {
                this.workflowService
                    .getNext()
                    .pipe(take(1))
                    .subscribe((data) =>
                        this.workflowBuilder.getCommand(data).execute()
                    );
            })
        );
    }

    private loadParticipants(): Observable<Participant[]> {
        return this.governedParticipantsAgent
            .getGovernedStudyParticipants(this.toolkitConfiguration.studyGuid)
            .pipe(take(1));
    }
}
