import { Component, Input } from '@angular/core';
import { ActivityInstance } from 'ddp-sdk';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  private _activities: ActivityInstance[];
  private _activeActivityId;

  @Input() set activities(activities: ActivityInstance[]) {
    this._activities = activities;
  }

  get activities(): ActivityInstance[] {
    return this._activities;
  }

  @Input() set activeActivityId(id: string) {
    this._activeActivityId = id;
  }

  get activeActivityId(): string {
    return this._activeActivityId;
  }

  get activeActivityNumber(): number {
    const activeActivity = this.activities.find(activity => activity.instanceGuid === this.activeActivityId);
    return this.activities.indexOf(activeActivity);
  }
}
