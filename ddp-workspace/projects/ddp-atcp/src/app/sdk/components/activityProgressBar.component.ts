import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  ActivityProgressCalculationService
} from '../services/activityProgressCalculation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-progress-bar',
  template: `
    <div class="app-activity-progress-bar">
      <span class="progress-title" translate>{{ title }}</span>
      <mat-progress-bar mode="determinate" value="{{ progress }}"></mat-progress-bar>
      <span class="progress-value">{{ progress }} %</span>
    </div>
  `,
  styles: [`
    .app-activity-progress-bar {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      margin: 0 0 28px 0;
    }

    mat-progress-bar {
      margin: 10px 0;
      height: 8px;
      width: 250px;
    }

    span {
      font-weight: 700;
      font-size: 16px;
    }
  `]
})
export class ActivityProgressBarComponent implements OnInit {
  private anchor: Subscription = new Subscription();
  @Input() title: string;
  progress: number;

  constructor(private activityProgressCalculationService: ActivityProgressCalculationService) {}

  ngOnInit(): void {
    const getActivityProgressSubs = this.activityProgressCalculationService.getProgress().subscribe(x => {
      this.progress = x;
    });
    this.anchor.add(getActivityProgressSubs);
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }
}
