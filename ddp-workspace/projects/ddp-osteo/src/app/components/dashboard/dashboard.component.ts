import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DashboardRedesignedComponent } from 'toolkit';
import { ActivityCode } from '../../types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DashboardRedesignedComponent {
  get isParent(): Observable<boolean> {
    return this.userActivities$.pipe(
      map(activities => activities.some(({ activityCode }) => activityCode === ActivityCode.Consent))
    );
  }

  get isChild(): Observable<boolean> {
    return this.userActivities$.pipe(
      map(activities => activities.some(({ activityCode }) => 
      activityCode === ActivityCode.ConsentAssent || activityCode === ActivityCode.ParentalConsent))
    );
  }

  get isLovedOne(): Observable<boolean> {
    return this.userActivities$.pipe(
      map(activities => activities.some(({ activityCode }) => activityCode === ActivityCode.LovedOne))
    );
  }
}
