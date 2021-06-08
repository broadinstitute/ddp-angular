import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ActivityResponse } from 'ddp-sdk';
import { map } from 'rxjs/operators';

@Component({
    selector: 'toolkit-activity',
    template: `
        <toolkit-header [showButtons]="false"
                        [stickySubtitle]="stickySubtitle">
        </toolkit-header>
        <ddp-activity *ngIf="instanceGuid"
                      [studyGuid]="studyGuid"
                      [activityGuid]="instanceGuid"
                      [selectedUserGuid]="selectedUserGuid"
                      (submit)="navigate($event)"
                      (stickySubtitle)="showStickySubtitle($event)">
        </ddp-activity>`
})
export class ActivityComponent implements OnInit {
    public instanceGuid: string;
    public studyGuid: string;
    public stickySubtitle: string;
    public activityCode: string;
    public selectedUserGuid: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.instanceGuid = params.get('id');
        });
        this.activatedRoute.queryParamMap.pipe(map(params => params.get('user_guid'))).subscribe((result) => {
            this.selectedUserGuid = result;
        });
        this.studyGuid = this.toolkitConfiguration.studyGuid;
    }

    public navigate(response: ActivityResponse, currentActivityCode?: string): void {
        const params = this.selectedUserGuid ? `user_guid=${this.selectedUserGuid}` : null;
        this.workflowBuilder.getCommand(response, currentActivityCode).execute(params);
    }

    public showStickySubtitle(stickySubtitle: string): void {
        this.stickySubtitle = stickySubtitle;
    }
}
