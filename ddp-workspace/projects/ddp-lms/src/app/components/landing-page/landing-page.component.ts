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
  private operatorUserTemp: string;
  private governedUserTemp: string;

  private readonly SELF_DESCRIBE_STABLE_ID = 'WHO_ENROLLING';
  private readonly GOVERNED_USER_ANSWERS_STABLE_ID = 'DIAGNOSED';

  constructor(
    private __router: Router,
    private __logger: LoggingService,
    private __auth0: Auth0AdapterService,
    private __sessionService: SessionMementoService,
    private __participantService: GovernedParticipantsServiceAgent,
    private __workflowService: WorkflowServiceAgent,
    private __workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private __config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private __toolkitConfiguration: ToolkitConfigurationService,
    private governedUserService: GovernedUserService,
    private governedParticipantsAgent: GovernedParticipantsServiceAgent,
    private prequalService: PrequalifierServiceAgent,
    private activityService: ActivityServiceAgent
  ) {
    super(
      __router,
      __logger,
      __auth0,
      __sessionService,
      __participantService,
      __workflowService,
      __workflowBuilder,
      __config,
      __toolkitConfiguration
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.load().subscribe();
  }

  private load(): Observable<any> {
    return this.governedUserService.checkIfGoverned.pipe(
      withLatestFrom(this.loadParticipants()),
      mergeMap(([isGoverned, participants]) =>
        iif(
          () => !participants.length && isGoverned,
          this.governedParticipantsAgent.addParticipant(this.__config.studyGuid),
          of(false)
        )
      ),
      filter((addedParticipant) => !!addedParticipant),
      tap((governedParticipant: any) => {
        this.operatorUserTemp = this.__sessionService.session.userGuid;
        this.governedUserTemp = governedParticipant;
        governedParticipant && this.__sessionService.setParticipant(governedParticipant);
      }),
      mergeMap((data) => data && this.__workflowService.fromParticipantList()),
      tap(() => {
        this.__sessionService.setParticipant(this.operatorUserTemp);
      }),
      mergeMap(() => this.prequalService.getPrequalifier(this.__config.studyGuid)),
      mergeMap((instanceGuid) => this.activityService.getActivity(of(this.__config.studyGuid), of(instanceGuid))),
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
          this.__sessionService.setParticipant(this.operatorUserTemp);
        } else {
          this.__sessionService.setParticipant(this.governedUserTemp);
        }
      }),
      mergeMap((data) => (data ? this.__workflowService.getNext() : this.__workflowService.fromParticipantList())),
      take(1)
    );
  }

  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.__toolkitConfiguration.studyGuid)
      .pipe(take(1));
  }
}
