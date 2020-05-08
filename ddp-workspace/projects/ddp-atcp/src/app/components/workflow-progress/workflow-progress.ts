import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivityInstance, CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

export const CREATED = 'CREATED';
export const IN_PROGRESS = 'IN_PROGRESS';
export const COMPLETE = 'COMPLETE';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.html',
  styleUrls: ['./workflow-progress.scss']
})
export class WorkflowProgressComponent implements OnInit, OnDestroy {
  @Input() public steps: ActivityInstance[] = [];
  @Input() public instanceGuid: string;
  @Output() public onChangeActivity = new EventEmitter<string>();

  public CREATED = CREATED;
  public IN_PROGRESS = IN_PROGRESS;
  public COMPLETE = COMPLETE;
  public statuses = {};
  private anchor = new CompositeDisposable();
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation('WorkflowProgress.Statuses')
      .subscribe(statuses => this.statuses = statuses);
    this.anchor.addNew(translate$);
  }

  public getStatus(step: ActivityInstance): string {
    if (step.statusCode === IN_PROGRESS || step.instanceGuid === this.instanceGuid) {
      return this.IN_PROGRESS;
    }
    return step.statusCode;
  }

  public changeActivity(step: ActivityInstance): void {
    if (step.statusCode === COMPLETE || step.statusCode === IN_PROGRESS) {
      this.onChangeActivity.emit(step.instanceGuid);
    }
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
