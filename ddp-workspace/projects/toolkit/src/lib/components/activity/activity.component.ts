import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { ActivityResponse } from 'ddp-sdk';

@Component({
    selector: 'toolkit-activity',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>
    <ng-template #newDesign>
        <ddp-redesigned-activity [studyGuid]="studyGuid"
                                 [activityGuid]="id"
                                 (submit)="navigate($event)"
                                 (stickySubtitle)="showStickySubtitle($event)"
                                 (activityCode)="activityCodeChanged($event)">
        </ddp-redesigned-activity>
    </ng-template>
    <ng-template #oldDesign>
        <toolkit-header [showButtons]="false"
                        [stickySubtitle]="stickySubtitle">
        </toolkit-header>
        <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="id"
                      (submit)="navigate($event)"
                      (stickySubtitle)="showStickySubtitle($event)">
        </ddp-activity>
    </ng-template>`
})
export class ActivityComponent implements OnInit {
    public id: string;
    public studyGuid: string;
    public stickySubtitle: string;
    public useRedesign: boolean;
    public activityCode: string;

    constructor(
        private headerConfig: HeaderConfigurationService,
        private activatedRoute: ActivatedRoute,
        private workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe(x => {
            this.id = x.id;
        });
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupActivityHeader();
    }

    public navigate(response: ActivityResponse): void {
        this.workflowBuilder.getCommand(response).execute();
    }

    public showStickySubtitle(stickySubtitle: string): void {
        this.stickySubtitle = stickySubtitle;
        this.headerConfig.stickySubtitle = stickySubtitle;
    }

    public activityCodeChanged(code: string): void {
        this.headerConfig.currentActivityCode = code;
    }
}
