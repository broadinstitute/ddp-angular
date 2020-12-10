import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityForm } from 'ddp-sdk';
import { ActivityCodes } from '../constants/activityCodes';

@Injectable()
export class ActivityProgressCalculationService {
  private progress = new BehaviorSubject(null);
  private activitiesToShowProgress = [ActivityCodes.MEDICAL_HISTORY, ActivityCodes.FEEDING];
  private sectionIndex: number | null;
  private sectionsAmount: number;
  private lastStepWeight: number;
  private stepWeights: Array<number>;

  public setProgress(activity: ActivityForm): void {
    if (this.activitiesToShowProgress.includes(activity.activityCode as ActivityCodes)) {
      this.sectionIndex = activity.sectionIndex;

      if (activity.readonly) {
        this.progress.next(100);
        return;
      }

      this.sectionsAmount = activity.sections.length;
      this.calculateStepWeights();

      this.calculateProgress(activity.sectionIndex);
    }
  }

  private calculateStepWeights(): void {
    const stepsAmount = this.sectionsAmount;
    const stepWeightFloat = (100 / (stepsAmount));
    let stepWeightRounded = Math.ceil(stepWeightFloat);
    if ((stepWeightRounded * (stepsAmount - 1)) > 100) {
        stepWeightRounded = Math.floor(stepWeightFloat);
    }

    // last step weight requires correction, therefore, initial arrays size = stepsAmsount -1
    this.stepWeights = Array(stepsAmount - 1);
    this.stepWeights.fill(stepWeightRounded);

    const correctionForLastStepWeight = 100 - (stepWeightRounded * (stepsAmount));
    this.lastStepWeight = stepWeightRounded + correctionForLastStepWeight;
    this.stepWeights.push(this.lastStepWeight);
  }

  public updateProgress(activity: ActivityForm, sectionIndex: number): void {
    if (this.activitiesToShowProgress.includes(activity.activityCode as ActivityCodes)
          && this.shouldUpdate(sectionIndex)) {
      this.sectionIndex = sectionIndex;
      this.calculateProgress(sectionIndex);
    }
  }

  private shouldUpdate(sectionIndex: number): boolean {
    return sectionIndex > this.sectionIndex;
  }

  private calculateProgress(sectionIndex: number | null): void {
    const currentProgress = this.stepWeights.slice(0, sectionIndex).reduce((acc, weight) => acc + weight, 0);
    this.progress.next(currentProgress);
  }

  public getProgress(): Observable<any> {
    return this.progress.asObservable();
  }
}
