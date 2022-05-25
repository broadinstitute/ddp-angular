import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';

import { ActivityResponse, CompositeDisposable, ConfigurationService } from 'ddp-sdk';
import { WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss'],
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

  onSubmit(response: ActivityResponse): void {
    if (response) {
      this.workflowBuilderService.getCommand(response).execute();
    }
  }
}
