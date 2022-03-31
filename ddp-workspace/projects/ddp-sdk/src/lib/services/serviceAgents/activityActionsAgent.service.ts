import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ActivityActionsAgent {
  private blockInstancesUpdated = new Subject<void>();

  emitActivityBlockInstancesUpdated(): void {
    this.blockInstancesUpdated.next();
  }

  get activityBlockInstancesUpdated(): Observable<void>{
    return this.blockInstancesUpdated.asObservable();
  }
}
