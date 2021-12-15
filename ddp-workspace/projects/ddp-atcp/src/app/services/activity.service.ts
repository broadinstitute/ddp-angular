import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Activity {
  instanceGuid: string;
  isConsentEdit?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private _currentActivity = new BehaviorSubject<Activity | null>(null);

  get currentActivity(): Activity | null {
    return this._currentActivity.getValue();
  }

  setCurrentActivity(
    instanceGuid: string | null,
    isConsentEdit: boolean = false,
  ): void {
    this._currentActivity.next({
      instanceGuid,
      isConsentEdit,
    });
  }
}
