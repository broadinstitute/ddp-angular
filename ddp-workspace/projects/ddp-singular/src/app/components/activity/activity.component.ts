import { Component, HostListener } from '@angular/core';
import { Route } from '../../constants/route';
import { ActivityCode } from '../../constants/activity-code';
import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';

declare const DDP_ENV: Record<string, any>;
type InputIds = {[key: string]: number};

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  Route = Route;
  isCaptchaResolved = false;

  @HostListener('document:keydown.enter', ['$event']) onEnter(event:KeyboardEvent) {
      event.preventDefault();
      this.nextLineInput(event)
  }

  private nextLineInput(event: KeyboardEvent) {
      const inputsArray: Element[] = Array.from(document.querySelectorAll('input, mat-select, select')).filter(input => input.id)
      const inputsIdsObject: InputIds = Object.fromEntries(inputsArray.map((input, i) => [input.id, i]))
      const pressedInputId = (event.target as HTMLInputElement).id;

      inputsIdsObject[pressedInputId] > -1 ? this.moveToNextInput(inputsArray, inputsIdsObject,pressedInputId) :
          this.moveToNextInput(inputsArray, inputsIdsObject, pressedInputId, true)
  }

  private moveToNextInput(inputs: Element[] | HTMLInputElement, inputsIdsObject:InputIds, PII: string, first?:boolean) {
      !first ?
          ((inputsIdsObject[PII] !== undefined && inputsIdsObject[PII] > -1) &&  inputs[inputsIdsObject[PII]+1] && inputs[inputsIdsObject[PII]+1].focus()) :
          inputs[0]?.focus();
  }

  get isPrequal(): boolean {
    return this.model && this.model.activityCode === ActivityCode.Prequal;
  }

  get captchaSiteKey(): string {
    return DDP_ENV.recaptchaSiteClientKey;
  }

  get submitText(): string {
    return this.isActivityWithUnusualButtons() ? 'Activity.Actions.Agree' : 'SDK.SubmitButton';
  }

  get displayDisagreeButton(): boolean {
    return this.isActivityWithUnusualButtons() && this.isLastTwoSections;
  }

  get displayAgreeIcon(): boolean {
    return this.isActivityWithUnusualButtons();
  }

  get isLastTwoSections(): boolean {
    const totalSections = this.model.sections.length;

    return [totalSections, totalSections - 1].includes(this.currentSectionIndex + 1);
  }

  get isConsent(): boolean {
    return this.model?.activityCode === ActivityCode.ConsentSelf ||
      this.model?.activityCode === ActivityCode.ConsentAssent ||
      this.model?.activityCode === ActivityCode.ConsentParental;
  }

  onCaptchaResolve(): void {
    this.isCaptchaResolved = true;
  }

  private isActivityWithUnusualButtons(): boolean {
    return !this.isReadonly() && this.isConsent;
  }
}
