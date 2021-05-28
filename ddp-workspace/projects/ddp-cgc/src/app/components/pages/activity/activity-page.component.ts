import { pluck } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { WorkflowBuilderService } from 'toolkit';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivityResponse, CompositeDisposable, ConfigurationService } from 'ddp-sdk';


@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss']
})
export class ActivityPageComponent implements OnInit, OnDestroy {

  studyGuid: string;
  instanceGuid: string;

  private subs = new CompositeDisposable();

  constructor(
    private route: ActivatedRoute,
    private workflowBuilderService: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  onSubmit(response: ActivityResponse): void {
    this.workflowBuilderService.getCommand(response).execute();
  }

  ngOnInit(): void {
    this.studyGuid = this.config.studyGuid;

    const sub = this.route.params.pipe(pluck('id')).subscribe(instanceGuid => {
      this.instanceGuid = instanceGuid;
    });

    this.subs.addNew(sub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }
}
