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
  template: ` <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned> `,
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent extends LoginLandingRedesignedComponent implements OnInit {
  private operatorUserTemp: string;
  private governedUserTemp: string;

  private readonly SELF_DESCRIBE_STABLE_ID = 'WHO_ENROLLING';
  private readonly GOVERNED_USER_ANSWERS_STABLE_ID = 'DIAGNOSED';
  private readonly CHILD_DIAGNOSED = 'CHILD_DIAGNOSED';
  private answers: [];

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
      tap((answers) => {
        this.answers = answers;
      }),
      withLatestFrom(this.loadParticipants()),
      mergeMap(([answers, participants]) =>
        iif(
          () => !participants.length && answers.find(({ stableId }) => stableId === this.CHILD_DIAGNOSED),
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
      mergeMap(() => this.__workflowService.fromParticipantList()),
      map(() => {
        const parent = this.answers.find((participant: any) => participant.stableId === this.CHILD_DIAGNOSED);
        if (parent) {
          this.__sessionService.setParticipant(this.operatorUserTemp);
          this.__workflowService.fromParticipantList()
          return false;
        }
        this.__workflowService.getNext()
        return true;
      }),
      take(1)
    );
  }

  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.__toolkitConfiguration.studyGuid)
      .pipe(take(1));
  }
}
