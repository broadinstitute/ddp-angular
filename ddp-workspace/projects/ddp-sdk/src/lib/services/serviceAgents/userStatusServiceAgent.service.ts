import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserServiceAgent } from './userServiceAgent.service';

@Injectable()
export class UserStatusServiceAgent extends UserServiceAgent<any> {
  public getStatus(): Observable<any> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/status`,
    ).pipe(take(1));
  }
}
