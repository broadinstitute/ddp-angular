import { Component, Inject, OnInit } from '@angular/core';
import { LoginLandingRedesignedComponent, ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { Router } from '@angular/router';
import {
  ActivityPicklistQuestionBlock,
  ActivityServiceAgent,
  Auth0AdapterService,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  LoggingService,
  Participant,
  PrequalifierServiceAgent,
  SessionMementoService,
  WorkflowServiceAgent,
} from 'ddp-sdk';
import { filter, mergeMap, pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import { iif, map, Observable, of } from 'rxjs';
import { GovernedUserService } from '../../services/governed-user.service';

@Component({
  selector: 'app-landing-page',
  template:  `
    <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `,
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent extends LoginLandingRedesignedComponent implements OnInit {
  private operatorUser: string;
  private governedUser: string;
  private readonly SELF_DESCRIBE_STABLE_ID = 'WHO_ENROLLING';
  private readonly GOVERNED_USER_ANSWERS_STABLE_ID = 'DIAGNOSED';

  constructor(
    router: Router,
    logger: LoggingService,
    auth0: Auth0AdapterService,
    protected sessionService: SessionMementoService,
    participantService: GovernedParticipantsServiceAgent,
    protected workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig')
    toolkitConfiguration: ToolkitConfigurationService,
    private governedUserService: GovernedUserService,
    protected governedParticipantsAgent: GovernedParticipantsServiceAgent,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent
  ) {
    super(
      router,
      logger,
      auth0,
      sessionService,
      participantService,
      workflowService,
      workflowBuilder,
      config,
      toolkitConfiguration
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.governedUserService.checkIfGoverned().subscribe();
    this.load().subscribe();
  }

  private load(): Observable<any> {
    return this.governedUserService.isGoverned$.pipe(
      take(1),
      withLatestFrom(this.loadParticipants()),
      tap((d) => console.log('my data', d)),
      mergeMap(([isGoverned, participants]) =>
        iif(
          () => !participants.length && isGoverned,
          this.governedParticipantsAgent.addParticipant(this.config.studyGuid),
          of(false)
        )
      ),
      filter((addedParticipant) => !!addedParticipant),
      tap((participant: any) => {
        this.operatorUser = this.sessionService.session.userGuid;
        this.governedUser = participant;
        participant && this.sessionService.setParticipant(participant);
      }),
      mergeMap((data) => data && this.workflowService.fromParticipantList()),
      tap(() => {
        this.sessionService.setParticipant(this.operatorUser);
      }),
      mergeMap((d) => this.prequalService.getPrequalifier(this.config.studyGuid)),
      mergeMap((instanceGuid) => this.activityService.getActivity(of(this.config.studyGuid), of(instanceGuid))),
      pluck('sections'),
      map((sections) => sections[0]),
      pluck('blocks'),
      map((blocks) =>
        blocks.find((block) => (block as ActivityPicklistQuestionBlock).stableId === this.SELF_DESCRIBE_STABLE_ID)
      ),
      pluck('answer'),
      map((answers) => answers.find(({ stableId }) => stableId === this.GOVERNED_USER_ANSWERS_STABLE_ID)),
      tap((participant: any) => {
        if (participant) {
          this.sessionService.setParticipant(this.operatorUser);
        } else {
          this.sessionService.setParticipant(this.governedUser);
        }
      }),
      mergeMap((data) => (data ? this.workflowService.getNext() : this.workflowService.fromParticipantList()))
    );
  }

  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.toolkitConfiguration.studyGuid)
      .pipe(take(1));
  }
}
