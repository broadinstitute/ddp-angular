import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivityInstance } from 'ddp-sdk';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesStoreService {
  activities$: Subject<ActivityInstance[]> = new Subject<ActivityInstance[]>();
}
