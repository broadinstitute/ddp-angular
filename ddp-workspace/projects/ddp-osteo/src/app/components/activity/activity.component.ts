import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ActivityActionsAgent,
    ActivityRedesignedComponent,
    AnalyticsEventsService,
    LoggingService,
    ParticipantsSearchServiceAgent,
    SubmitAnnouncementService,
    WindowRef
} from 'ddp-sdk';
import { Subscription } from 'rxjs';

import { SubmitButtonPlacement } from '../../types';
import {
  blockInstancesHaveAnswers,
  isAboutYouOrChildActivity,
  isEnabledModalActivityBlock
} from '../../utils';
import {ToolkitConfigurationService} from 'toolkit';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styles: [`
      .activity-buttons-middle {
          margin: 2rem 0 4rem;
      }
  `]
})
export class ActivityComponent extends ActivityRedesignedComponent implements OnInit, OnDestroy {
  SubmitButtonPlacement = SubmitButtonPlacement;
  showEmptyNestedActivityError = false;
  dialogsClosedSubscription: Subscription;
  activityInstanceDeletedSubscription: Subscription;

  constructor(
    private editDialog: MatDialog,
    private activityActionsAgent: ActivityActionsAgent,
    logger: LoggingService,
    windowRef: WindowRef,
    changeRef: ChangeDetectorRef,
    renderer: Renderer2,
    submitService: SubmitAnnouncementService,
    analytics: AnalyticsEventsService,
    participantsSearch: ParticipantsSearchServiceAgent,
    @Inject(DOCUMENT) document: any,
    injector: Injector,
    @Inject('toolkit.toolkitConfig') private toolkitConfig: ToolkitConfigurationService,
  ) {
    super(
      logger,
      windowRef,
      changeRef,
      renderer,
      submitService,
      analytics,
      participantsSearch,
      document,
      injector
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.dialogsClosedSubscription = this.editDialog.afterAllClosed.subscribe(this.updateErrorMessageDisplayState);

    this.activityInstanceDeletedSubscription =
      this.activityActionsAgent.activityBlockInstancesUpdated.subscribe(this.updateErrorMessageDisplayState);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.dialogsClosedSubscription.unsubscribe();
    this.activityInstanceDeletedSubscription.unsubscribe();
  }

    public get studyEmail(): string {
        return this.toolkitConfig.infoEmail;
    }

    public get studyPhone(): string {
        return this.toolkitConfig.phone;
    }

  public incrementStep(): void {
    if (this.allNestedActivitiesHaveAnswers) {
      this.showEmptyNestedActivityError = false;
      super.incrementStep();
    } else {
      this.showEmptyNestedActivityError = true;
    }
  }

  public updateErrorMessageDisplayState = (): boolean =>
    this.showEmptyNestedActivityError = !this.allNestedActivitiesHaveAnswers;

  get allNestedActivitiesHaveAnswers(): boolean {
    return this.currentSection.blocks
      .filter(isEnabledModalActivityBlock)
      .every(blockInstancesHaveAnswers);
  }

  get submitButtonPlacement(): SubmitButtonPlacement {
    return isAboutYouOrChildActivity(this.model?.activityCode)
    ? SubmitButtonPlacement.BeforeClosingSection
    : SubmitButtonPlacement.AfterClosingSection;
  }
}
