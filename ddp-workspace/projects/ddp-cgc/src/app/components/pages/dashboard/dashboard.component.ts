import { map } from 'rxjs/operators';
import { DashboardFacade } from './facade';
import { Observable, combineLatest } from 'rxjs';
import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { ActivityCode } from '../../../constants/activity-code';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { releaseRequestsProvider, RELEASE_REQUESTS, ACTIVITIES, activitiesProvider } from './providers';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [releaseRequestsProvider, activitiesProvider, DashboardFacade]
})
export class DashboardComponent {
  loading$: Observable<boolean>;
  showReleaseRequests$: Observable<boolean>;

  constructor(
    private readonly facade: DashboardFacade,
    @Inject(ACTIVITIES) public readonly activities$: Observable<ActivityInstance[]>,
    @Inject(RELEASE_REQUESTS) public readonly releaseRequests$: Observable<ActivityInstance[]>
  ) {
    this.setObservables();
  }

  onStartActivity({ instanceGuid }: ActivityInstance): void {
    this.facade.startActivity(instanceGuid);
  }

  onContinueActivity({ instanceGuid }: ActivityInstance): void {
    this.facade.continueActivity(instanceGuid);
  }

  onViewActivity({ instanceGuid }: ActivityInstance): void {
    this.facade.viewActivity(instanceGuid);
  }

  onStartNewReleaseRequest(code: ActivityCode): void {
    this.facade.startNewReleaseRequest(code);
  }

  private setObservables(): void {
    this.loading$ = combineLatest([this.activities$, this.releaseRequests$]).pipe(
      map(() => true)
    );
    this.showReleaseRequests$ = this.activities$.pipe(
      map((activities: ActivityInstance[]) => !!activities.find(
        ({ activityCode, statusCode }: ActivityInstance) => activityCode === ActivityCode.Consent
                                                         && statusCode === ActivityStatusCodes.COMPLETE
      ))
    );
  }
}
