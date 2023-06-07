import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {
  ActivityRedesignedComponent,
  HeaderConfigurationService,
  ToolkitConfigurationService,
  WorkflowBuilderService
} from 'toolkit';
import {ActivatedRoute} from '@angular/router';
import {
  ACTUAL_PARTICIPANT_ID_TOKEN,
  actualParticipantIdProvider
} from './localProviders';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {ActivityResponse, SessionMementoService} from 'ddp-sdk';

@Component({
  selector: 'app-activity-page',
  template: `
    <app-activity
      *ngIf="!rerender"
      [studyGuid]="studyGuid"
      [activityGuid]="instanceGuid"
      [agreeConsent]="config.agreeConsent"
      (submit)="navigate($event)"
      (stickySubtitle)="showStickySubtitle($event)"
      (activityCode)="activityCodeChanged($event)">
    </app-activity>
  `,
  providers: [actualParticipantIdProvider]
})
export class ActivityPageComponent extends ActivityRedesignedComponent implements OnInit {
  public rerender = false

  constructor(
    @Inject(ACTUAL_PARTICIPANT_ID_TOKEN) private readonly participantId$: Observable<string>,
    private readonly sessionService: SessionMementoService,
     headerConfig: HeaderConfigurationService,
     _activatedRoute: ActivatedRoute,
     _workflowBuilder: WorkflowBuilderService,
    @Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService,
    private cdr: ChangeDetectorRef,
  ) {
    super(headerConfig, _activatedRoute, _workflowBuilder, config);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setParticipantGuid();
  }

  override navigate(response: ActivityResponse) {
    super.navigate(response);
    this.rerenderActivity();
  }

  protected rerenderActivity(): void {
    this.rerender = true;
    this.cdr.detectChanges();
    this.rerender = false;
  }

  private setParticipantGuid(): void {
    this.participantId$
      .pipe(
        first(),
        tap((participantGuid: string) => this.sessionService.setParticipant(participantGuid)),
      )
      .subscribe();
  }
}
