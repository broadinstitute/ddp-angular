import { Component, Input } from '@angular/core';
import { Utils } from '../utils/utils';
import { ActivityData } from './activity-data.model';
import { ActivityDefinition } from './models/activity-definition.model';

@Component({
  selector: 'app-activity-data',
  templateUrl: './activity-data.component.html',
  styleUrls: [ './activity-data.component.css' ]
})
export class ActivityDataComponent {
  @Input() activity: ActivityData;
  @Input() activityDefinition: ActivityDefinition;

  constructor(private util: Utils) {
  }

  getUtil(): Utils {
    return this.util;
  }

  getUtilStatic(): typeof Utils {
    return Utils;
  }

  getActivityName(activityDefinition: ActivityDefinition): string {
    return activityDefinition.activityName;
  }

  getActivityCode( activity: ActivityData ): string {
    return activity.activityCode;
  }
}
