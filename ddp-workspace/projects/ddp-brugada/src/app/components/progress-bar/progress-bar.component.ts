import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, Inject  } from '@angular/core';
import { activitiesList, ActivityListItem } from '../../constants/activities';
import { activeActivityNumberProvider, ACTIVE_ACTIVITY_NUMBER } from './providers';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  providers: [activeActivityNumberProvider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  private static activitiesList: ActivityListItem[] = activitiesList;

  get activities(): ActivityListItem[] {
    return ProgressBarComponent.activitiesList;
  }

  constructor(
    @Inject(ACTIVE_ACTIVITY_NUMBER) readonly activeActivityNumber$: Observable<number>
  ) {}
}
