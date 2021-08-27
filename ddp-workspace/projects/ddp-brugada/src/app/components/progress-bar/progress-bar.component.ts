import { Observable } from 'rxjs';
import { ActivityStatusCodes } from 'ddp-sdk';
import { activeActivityNumberProvider, ACTIVITEIS } from './providers';
import { ActivityListItem } from './../../interfaces/activity-list-item';
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
    @Inject(ACTIVITEIS) readonly activities$: Observable<ActivityListItem[]>
  ) {}
}
