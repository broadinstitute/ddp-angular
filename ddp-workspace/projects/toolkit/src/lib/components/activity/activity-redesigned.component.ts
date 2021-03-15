import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityComponent } from './activity.component';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-activity-redesigned',
    template: `
        <ddp-activity-redesigned [studyGuid]="studyGuid"
                                 [activityGuid]="id"
                                 [agreeConsent]="config.agreeConsent"
                                 [activitiesWithVerticalProgress]="config.usesVerticalStepper"
                                 (submit)="navigate($event)"
                                 (stickySubtitle)="showStickySubtitle($event)"
                                 (activityCode)="activityCodeChanged($event)">
        </ddp-activity-redesigned>`
})
export class ActivityRedesignedComponent extends ActivityComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        private _activatedRoute: ActivatedRoute,
        private _workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
        super(_activatedRoute, _workflowBuilder, config);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupActivityHeader();
    }

    public showStickySubtitle(stickySubtitle: string): void {
        this.headerConfig.stickySubtitle = stickySubtitle;
    }

    public activityCodeChanged(code: string): void {
        this.headerConfig.currentActivityCode = code;
    }
}
