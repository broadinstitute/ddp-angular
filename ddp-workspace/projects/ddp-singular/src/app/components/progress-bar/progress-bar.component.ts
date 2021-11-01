import { Observable } from 'rxjs';
import { ActivityStatusCodes } from 'ddp-sdk';
import { activeActivityNumberProvider, ACTIVITIES } from './providers';
import { ActivityListItem } from '../../interfaces/activity-list-item';
import { ChangeDetectionStrategy, Component, Inject  } from '@angular/core';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  providers: [activeActivityNumberProvider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  ActivityStatusCodes = ActivityStatusCodes;

  constructor(
    @Inject(ACTIVITIES) readonly activities$: Observable<ActivityListItem[]>
  ) {}
}
