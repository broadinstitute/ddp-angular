import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityPageComponent } from './activity-page.component';
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
export class ActivityPageRedesignedComponent extends ActivityPageComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        private _serviceAgent: ActivityServiceAgent,
        private _userActivityServiceAgent: UserActivityServiceAgent,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _workflowBuilder: WorkflowBuilderService,
        private _logger: LoggingService,
        @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
        super(
            _serviceAgent,
            _userActivityServiceAgent,
            _router,
            _activatedRoute,
            _workflowBuilder,
            _logger,
            _toolkitConfiguration);
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
