import { Observable, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { ActivitiesStoreService } from './../services/activities-store.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivityInstance, ConfigurationService, UserActivityServiceAgent } from 'ddp-sdk';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesResolver implements Resolve<unknown> {
  constructor(
    private readonly userActivityService: UserActivityServiceAgent,
    private readonly activitiesStoreService: ActivitiesStoreService,
    @Inject('ddp.config') private readonly config: ConfigurationService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<unknown> {
    this.userActivityService.getActivities(of(this.config.studyGuid)).pipe(
      first(),
      tap((activities: ActivityInstance[]) => this.activitiesStoreService.activities$.next(activities))
    ).subscribe();

    return of(null);
  }
}
