import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ActivityInstance } from 'ddp-sdk';

@Injectable({
  providedIn: 'root'
})
export class CurrentActivityService {
  activity$ = new BehaviorSubject<ActivityInstance | null>(null);
}
