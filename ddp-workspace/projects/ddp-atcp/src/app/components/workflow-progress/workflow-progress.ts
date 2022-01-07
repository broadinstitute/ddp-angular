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
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onChangeActivity = new EventEmitter<ActivityInstance>();

  public CREATED = CREATED;
  public IN_PROGRESS = IN_PROGRESS;
  public COMPLETE = COMPLETE;
  public statuses = {};
  private anchor = new CompositeDisposable();
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation(['WorkflowProgress.Statuses'])
      .subscribe((statuses: Record<string, unknown>) => {
        this.statuses = statuses;
      });
    this.anchor.addNew(translate$);
  }

  public get currentActivity(): ActivityInstance {
    if (!this.steps) {
      return null;
    }

    const inProgressActivity = this.steps.find(
      activity => activity.statusCode === IN_PROGRESS
    );
    // eslint-disable-next-line curly
    if (inProgressActivity) return inProgressActivity;

    const createdActivity = this.steps.find(
      activity => activity.statusCode === CREATED
    );
    // eslint-disable-next-line curly
    if (createdActivity) return createdActivity;

    return null;
  }

  public changeActivity(step: ActivityInstance): void {
    if (step.statusCode === COMPLETE || step.statusCode === IN_PROGRESS || step === this.currentActivity) {
      this.onChangeActivity.emit(step);
    }
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
