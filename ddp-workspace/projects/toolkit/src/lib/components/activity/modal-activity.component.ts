import {
  Component,
  Inject,
  Injector, Input,
  Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivityComponent,
  WindowRef,
  SubmitAnnouncementService,
  AnalyticsEventsService,
  SubmissionManager,
  LoggingService
} from 'ddp-sdk';
import { ModalActivityData } from '../../models/modalActivityData';

@Component({
  selector: 'toolkit-modal-activity',
  template: `
    <div class="CenterChild" *ngIf="!isLoaded">
      <mat-spinner></mat-spinner>
    </div>
    <div class="ModalActivity--header" *ngIf="model && isLoaded">
      <h1 class="PageContent-title" [innerHTML]="model.title"></h1>
      <button mat-icon-button (click)="this.dialog.closeAll()"><mat-icon>close</mat-icon></button>
    </div>
    <div [ngClass]="{'ModalActivity--request' : !isLastStep, 'ModalActivity--requestSubmitted' : isLastStep}"
         *ngIf="model && isLoaded">
      <div mat-dialog-content>
        <mat-icon *ngIf="isLastStep">check_circle_outline</mat-icon>
        <ng-container>
          <ddp-activity-section
            [section]="currentSection"
            [validationRequested]="validationRequested"
            [studyGuid]="studyGuid"
            [activityGuid]="activityGuid"
            (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(1, $event)"
            (embeddedComponentBusy)="embeddedComponentBusy$[1].next($event)">
          </ddp-activity-section>
        </ng-container>
      </div>
      <div mat-dialog-actions align="end" *ngIf="model && isLoaded">
        <button *ngIf="!isFirstStep && !isLastStep && data.prevButtonText"
                (click)="decrementStep(false)"
                class="Button ModalActivity--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="data.prevButtonText | translate"></button>

        <button *ngIf="!isLastStep && data.nextButtonText"
                (click)="incrementStep(false)"
                class="Button ModalActivity--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="data.nextButtonText | translate"></button>

        <button *ngIf="isLastStep && !data.showFinalConfirmation"
                (click)="close()"
                class="Button ModalActivity--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="data.submitButtonText | translate"></button>

        <!-- final confirmation if present is always the last step after submission -->
        <button *ngIf="isStepBeforeLast && data.showFinalConfirmation"
                (click)="incrementStep(false)"
                class="Button ModalActivity--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="data.submitButtonText | translate"></button>

        <button *ngIf="isLastStep && data.showFinalConfirmation"
                (click)="close()"
                class="Button ModalActivity--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="data.confirmationButtonText | translate"></button>
      </div>
    </div>`,
  providers: [SubmitAnnouncementService, SubmissionManager]
})
export class ModalActivityComponent extends ActivityComponent {
  @Input() data: ModalActivityData;

  constructor(public dialog: MatDialog,
              logger: LoggingService,
              windowRef: WindowRef,
              renderer: Renderer2,
              submitService: SubmitAnnouncementService,
              analytics: AnalyticsEventsService,
              @Inject(DOCUMENT) document: any,
              injector: Injector) {
    super(logger, windowRef, renderer, submitService, analytics, document, injector);
  }

  public get isStepBeforeLast(): boolean {
    return this.currentSectionIndex === this.model.sections.length - 2;
  }

  public close(): void {
    this.flush();
    this.dialog.closeAll();
  }
}
