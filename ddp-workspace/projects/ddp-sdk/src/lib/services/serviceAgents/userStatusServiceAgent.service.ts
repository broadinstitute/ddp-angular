import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserStatusResponse } from '../../models/userStatusResponse';
import { UserServiceAgent } from './userServiceAgent.service';

@Injectable()
export class UserStatusServiceAgent extends UserServiceAgent<any> {
  public getStatus(): Observable<UserStatusResponse> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/status`,
    ).pipe(take(1));
  }
}
