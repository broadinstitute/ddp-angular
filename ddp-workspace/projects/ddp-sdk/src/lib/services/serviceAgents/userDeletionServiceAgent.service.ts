import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserServiceAgent } from './userServiceAgent.service';

@Injectable()
export class UserDeletionServiceAgent extends UserServiceAgent<void> {
  public deleteUser(userGuid: string): Observable<void> {
    const url = `${this.configuration.backendUrl}/pepper/v1/user/${userGuid}`;

    return this.deleteObservable(url).pipe(take(1));
  }

  protected getBackendUrl(): string {
    return '';
  }
}
