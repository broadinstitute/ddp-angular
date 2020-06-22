import { Component, Inject, OnInit } from "@angular/core";
import { ActivityComponent, ToolkitConfigurationService, WorkflowBuilderService } from "toolkit";
import { ActivatedRoute } from "@angular/router";

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
export class PrionActivityComponent extends ActivityComponent implements OnInit {
  public id: string;
  public studyGuid: string;
  public useRedesign: boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _workflowBuilder: WorkflowBuilderService,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
    super(_activatedRoute, _workflowBuilder, _toolkitConfiguration);
  }
}
