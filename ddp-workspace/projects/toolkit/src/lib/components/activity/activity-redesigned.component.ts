import { ActivityComponent } from './activity.component';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-activity-redesigned',
    template: `
        <ddp-activity-redesigned [studyGuid]="studyGuid"
                                 [activityGuid]="id"
                                 (submit)="navigate($event)"
                                 (stickySubtitle)="showStickySubtitle($event)"
                                 (activityCode)="activityCodeChanged($event)">
        </ddp-activity-redesigned>`
})
export class ActivityRedesignedComponent extends ActivityComponent {
    constructor(
        headerConfig: HeaderConfigurationService,
        activatedRoute: ActivatedRoute,
        workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
        super(headerConfig, activatedRoute, workflowBuilder, toolkitConfiguration)
    }
}
