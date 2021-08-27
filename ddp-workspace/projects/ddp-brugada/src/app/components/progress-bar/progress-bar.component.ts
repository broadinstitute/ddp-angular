import { Observable } from 'rxjs';
import { ActivityStatusCodes } from 'ddp-sdk';
import { ActivityListItem } from './../../interfaces/activity-list-item';
import { ChangeDetectionStrategy, Component, Inject  } from '@angular/core';
import { activeActivityNumberProvider, ACTIVE_ACTIVITY_NUMBER } from './providers';


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
    @Inject(ACTIVE_ACTIVITY_NUMBER) readonly activities$: Observable<ActivityListItem[]>
  ) {}
}
