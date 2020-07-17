import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ActivityForm} from "../models/activity/activityForm";
import {ActivityCodes} from '../constants/activityCodes';

@Injectable()
export class ActivityProgressCalculationService {
  private progress = new BehaviorSubject(null);
  private activityToShowProgress = ActivityCodes.MEDICAL_HISTORY;
  private sectionIndex: number | null
  private sectionsAmount: number;
  private sectionWeight: number;
  private lastSectionWeight: number;
  private weight: Array<number>;

  public setProgress(activity: ActivityForm) {
    if (activity.activityCode === this.activityToShowProgress) {
      this.sectionIndex = activity.sectionIndex;

      if (activity.readonly) {
        this.progress.next(100);
        return;
      }

      this.sectionsAmount = activity.sections.length;
      this.calculateSectionsWeight();
      this.calculateProgress(activity.sectionIndex);
    }
  }

  private calculateSectionsWeight() {
    this.sectionWeight = +(100 / (this.sectionsAmount - 1)).toFixed(0);
    this.lastSectionWeight = 100 - this.sectionWeight * (this.sectionsAmount - 1) + this.sectionWeight;
    this.weight = Array(this.sectionsAmount - 2).fill(this.sectionWeight);
    this.weight.push(this.lastSectionWeight);
  }


  public updateProgress(activity, sectionIndex) {
    if (activity.activityCode === this.activityToShowProgress
          && this.shouldUpdate(sectionIndex)) {
      this.sectionIndex = sectionIndex;
      this.calculateProgress(sectionIndex);
    }
  }

  private shouldUpdate(sectionIndex) {
    return sectionIndex > this.sectionIndex;
  }

  private calculateProgress(sectionIndex: number | null) {
   const currentProgress = this.weight.slice(0, sectionIndex).reduce((acc, weight) => acc + weight, 0);
   this.progress.next(currentProgress);
  }

  public getProgress(): Observable<any> {
    return this.progress.asObservable();
  }
}
