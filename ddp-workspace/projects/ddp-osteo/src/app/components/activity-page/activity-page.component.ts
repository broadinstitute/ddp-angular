import { Component, Inject, OnInit } from "@angular/core";
import {
    ActivityRedesignedComponent,
    HeaderConfigurationService,
    ToolkitConfigurationService,
    WorkflowBuilderService,
} from "toolkit";
import { Observable } from "rxjs";
import { SessionMementoService } from "ddp-sdk";
import { ActivatedRoute } from "@angular/router";
import { first, tap } from "rxjs/operators";
import {
    ACTUAL_PARTICIPANT_ID_TOKEN,
    actualParticipantIdProvider,
} from "./osteo-providers";

@Component({
    selector: "app-activity-page",
    template: `
        <app-activity
            [studyGuid]="studyGuid"
            [activityGuid]="instanceGuid"
            [agreeConsent]="config.agreeConsent"
            (submit)="navigate($event)"
            (stickySubtitle)="showStickySubtitle($event)"
            (activityCode)="activityCodeChanged($event)"
        >
        </app-activity>
    `,
    providers: [actualParticipantIdProvider],
})
export class ActivityPageComponent
    extends ActivityRedesignedComponent
    implements OnInit
{
    constructor(
        @Inject(ACTUAL_PARTICIPANT_ID_TOKEN) private readonly participantId$: Observable<string>,
        private readonly sessionService: SessionMementoService,
        headerConfig: HeaderConfigurationService,
        _activatedRoute: ActivatedRoute,
        _workflowBuilder: WorkflowBuilderService,
        @Inject("toolkit.toolkitConfig") config: ToolkitConfigurationService
    ) {
        super(headerConfig, _activatedRoute, _workflowBuilder, config);
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.setParticipantGuid();
    }

    private setParticipantGuid(): void {
        this.participantId$
            .pipe(
                first(),
                tap((participantGuid: string) =>
                    this.sessionService.setParticipant(participantGuid)
                )
            )
            .subscribe();
    }
}
