import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SessionServiceAgent } from './sessionServiceAgent.service';

@Injectable()
export class UserManagementServiceAgent extends SessionServiceAgent<void> {
  public deleteUser(userGuid: string): Observable<void> {
    return this.deleteObservable(`/user/${userGuid}`).pipe(take(1));
  }
}
