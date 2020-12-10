import {Injectable, OnDestroy} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {ActivityServiceAgent, ActivityForm, CompositeDisposable} from 'ddp-sdk';
import { filter, take, tap } from 'rxjs/operators';
import { ActivityProgressCalculationService } from './activityProgressCalculation.service';
import { ActivityCodes } from '../constants/activityCodes';

@Injectable()
export class CurrentActivityService implements OnDestroy {
  activitiesToShowProgress = [ActivityCodes.MEDICAL_HISTORY, ActivityCodes.FEEDING];

  private activity = new BehaviorSubject(null);
 private anchor: CompositeDisposable = new CompositeDisposable();
  constructor(private activityServiceAgent: ActivityServiceAgent,
              private activityProgressCalculationService: ActivityProgressCalculationService) {
    this.anchor
      .addNew(this.activity
      .pipe(filter(x => x !== null))
      .subscribe(x => this.activityProgressCalculationService.setProgress(x)));
  }

  public getActivity(studyGuid: Observable<string | null>,
                     activityGuid: Observable<string | null>): Observable<ActivityForm> {
    return this.activityServiceAgent
      .getActivity(studyGuid, activityGuid)
      .pipe(tap(x => this.saveCurrentActivity(x)));
  }

  public updateActivitySection(studyGuid: string,
                               activityGuid: string,
                               activity: ActivityForm,
                               sectionIndex: number): void {
    if (this.activitiesToShowProgress.includes(activity.activityCode as ActivityCodes)) {
      const initialSectionIndex = activity.sectionIndex;

      this.activityProgressCalculationService.updateProgress(activity, sectionIndex);

      if (sectionIndex > initialSectionIndex) {
        this.anchor.addNew(
          this.activityServiceAgent
            .saveLastVisitedActivitySection(studyGuid, activityGuid, sectionIndex)
            .pipe(take(1))
            .subscribe()
        );
      }
    }
  }

  public saveCurrentActivity(value): void {
    this.activity.next(value);
  }

  public getCurrentActivity(): Observable<ActivityForm | null> {
    return this.activity.asObservable();
  }

  ngOnDestroy(): void {
   this.anchor.removeAll();
  }
}
