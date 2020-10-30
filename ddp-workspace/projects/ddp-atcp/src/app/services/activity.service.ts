import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private _currentActivityInstanceGuid = new BehaviorSubject<string | null>(null);

  get currentActivityInstanceGuid(): string | null {
    return this._currentActivityInstanceGuid.getValue();
  }

  set currentActivityInstanceGuid(instanceGuid: string | null) {
    this._currentActivityInstanceGuid.next(instanceGuid);
  }
}
