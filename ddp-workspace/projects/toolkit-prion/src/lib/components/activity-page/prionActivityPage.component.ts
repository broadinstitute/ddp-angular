import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivityServiceAgent, LoggingService, UserActivityServiceAgent } from "ddp-sdk";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivityPageComponent, ToolkitConfigurationService, WorkflowBuilderService } from "toolkit";

@Component({
    selector: 'prion-activity-page',
    template: `
    <ng-container>
        <prion-header>
        </prion-header>
        <div class="ContainerSurvey-top row">
            <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                      (submit)="raiseSubmit($event)"
                      class="ContainerSurvey col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
        </ddp-activity>
        </div>
     </ng-container>`
})
export class PrionActivityPageComponent extends ActivityPageComponent implements OnInit, OnDestroy {

    constructor(
        private _serviceAgent: ActivityServiceAgent,
        private _userActivityServiceAgent: UserActivityServiceAgent,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _workflowBuilder: WorkflowBuilderService,
        private _logger: LoggingService,
        @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
        super(_serviceAgent, _userActivityServiceAgent, _router, _activatedRoute, _workflowBuilder, _logger, _toolkitConfiguration);
    }


}
