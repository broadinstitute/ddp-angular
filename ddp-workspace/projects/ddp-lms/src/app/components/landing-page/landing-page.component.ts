import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { Router } from '@angular/router';
import {
  ActivityResponse,
  Auth0AdapterService,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  LoggingService,
  Participant,
  SessionMementoService,
  WorkflowServiceAgent,
} from 'ddp-sdk';
import { filter, finalize, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { iif, Observable, of } from 'rxjs';
import { GovernedUserService } from '../../services/governed-user.service';

@Component({
  selector: 'app-landing-page',
  template: ` <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned> `,
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  private operatorUserTemp: string;

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
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
    private governedUserService: GovernedUserService,
    private governedParticipantsAgent: GovernedParticipantsServiceAgent
  ) {}

  ngOnInit(): void {
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
          this.governedParticipantsAgent.addParticipant(this.config.studyGuid),
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
        const parent = this.answers.find((participant: any) => participant.stableId === this.SELF_DIAGNOSED);
        parent && this.sessionService.setParticipant(this.operatorUserTemp);
      }),
      take(1),
      finalize(() => {
        this.workflowService.getNext().pipe(take(1)).subscribe(data => this.workflowBuilder.getCommand(data).execute())
      })
    );
  }


  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.toolkitConfiguration.studyGuid)
      .pipe(take(1));
  }
}
