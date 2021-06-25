import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

import {
  ActivityRedesignedComponent,
  ActivityStatusCodes,
  SubmissionManager,
  SubmitAnnouncementService,
} from 'ddp-sdk';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent
  extends ActivityRedesignedComponent
  implements OnInit
{
  ngOnInit(): void {
    super.ngOnInit();

    this.initFixedStepper();
  }

  private initFixedStepper(): void {
    const isLoaded$ = this.getIsLoaded$();

    const sub = isLoaded$.pipe(filter(isLoaded => isLoaded)).subscribe(() => {
      if (this.model.statusCode !== ActivityStatusCodes.COMPLETE) {
        // @ts-ignore
        this.shouldSaveLastStep = this.config.usesVerticalStepper.includes(
          this.model.activityCode,
        );

        this.currentSectionIndex = this.model.sectionIndex || 0;

        this.visitedSectionIndexes = this.visitedSectionIndexes.map(
          (_, index) => index <= this.currentSectionIndex,
        );
      }
    });

    this.anchor.addNew(sub);
  }
}
