import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityPageComponent } from './activityPage.component';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import {
    LoggingService,
    UserActivityServiceAgent,
    ActivityServiceAgent,
} from 'ddp-sdk';

@Component({
    selector: 'toolkit-activity-page-redesigned',
    template: `
        <ddp-activity-redesigned [studyGuid]="studyGuid"
                                 [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                                 (submit)="raiseSubmit($event)"
                                 (stickySubtitle)="showStickySubtitle($event)"
                                 (activityCode)="activityCodeChanged($event)">
        </ddp-activity-redesigned>`
})
export class ActivityPageRedesignedComponent extends ActivityPageComponent {
    constructor(
        serviceAgent: ActivityServiceAgent,
        userActivityServiceAgent: UserActivityServiceAgent,
        router: Router,
        activatedRoute: ActivatedRoute,
        workflowBuilder: WorkflowBuilderService,
        logger: LoggingService,
        headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
        super(
            serviceAgent,
            userActivityServiceAgent,
            router, activatedRoute,
            workflowBuilder,
            logger,
            headerConfig,
            toolkitConfiguration);
    }
}
