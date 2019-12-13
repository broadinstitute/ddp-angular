import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from './../../services/workflowBuilder.service';
import { ActivityResponse } from 'ddp-sdk';

@Component({
    selector: 'toolkit-activity',
    template: `
    <ng-container>
        <toolkit-header>
        </toolkit-header>
        <div class="ContainerSurvey-top row">
        <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="id"
                      (submit)="navigate($event)"
                      class="ContainerSurvey col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
        </ddp-activity>
        </div>
    </ng-container>`
})
export class ActivityComponent implements OnInit {
    public id: string;
    public studyGuid: string;
    public useRedesign: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe(x => {
            this.id = x.id;
        });
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
    }

    public navigate(response: ActivityResponse): void {
        this.workflowBuilder.getCommand(response).execute();
    }
}
