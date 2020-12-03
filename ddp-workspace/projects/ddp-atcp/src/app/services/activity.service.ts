import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Payload {
  activityInstanceGuid: string;
  isConsentEditActivity?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private _currentActivityInstanceGuid = new BehaviorSubject<Payload | null>(
    null
  );

  get currentActivityInstanceGuid(): Payload | null {
    return this._currentActivityInstanceGuid.getValue();
  }

  setCurrentActivityInstanceGuid(
    instanceGuid: string | null,
    isConsentEditActivity: boolean = false
  ) {
    this._currentActivityInstanceGuid.next({
      activityInstanceGuid: instanceGuid,
      isConsentEditActivity,
    });
  }
}
