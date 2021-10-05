import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivityInstance } from 'ddp-sdk';


export interface Activity {
  instance: ActivityInstance;
  isReadonly: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentActivityService {
  activity$ = new BehaviorSubject<Activity | null>(null);
}
