import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivityComponent, WindowRef, SubmitAnnouncementService, AnalyticsEventsService, SubmissionManager } from 'ddp-sdk';

@Component({
  selector: 'toolkit-data-request-activity',
  template: `
    <div class="CenterChild" *ngIf="!isLoaded">
      <mat-spinner></mat-spinner>
    </div>
    <div class="DataRequestModal--header" *ngIf="model && isLoaded">
      <h1 class="PageContent-title" [innerHTML]="model.title"></h1>
      <button mat-icon-button (click)="closeModal()"><mat-icon>close</mat-icon></button>
    </div>
    <div [ngClass]="{'DataRequestModal--request' : !isLastStep, 'DataRequestModal--requestSubmitted' : isLastStep}"
         *ngIf="model && isLoaded">
      <div mat-dialog-content>
        <mat-icon *ngIf="isLastStep">check_circle_outline</mat-icon>
        <ng-container>
          <ddp-activity-section
            [section]="currentSection"
            [validationRequested]="validationRequested"
            [studyGuid]="studyGuid"
            [activityGuid]="activityGuid"
            (visibilityChanged)="updateVisibility($event)"
            (embeddedComponentsValidationStatus)="updateEmbeddedComponentValidationStatus(1, $event)"
            (embeddedComponentBusy)="embeddedComponentBusy$[1].next($event)">
          </ddp-activity-section>
        </ng-container>
      </div>
      <div mat-dialog-actions align="end" *ngIf="model && isLoaded">
        <button (click)="isLastStep ? closeModal() : submitDataRequest()"
                class="Button DataRequestModal--submit col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="isLastStep
                ? ('Toolkit.DataRequest.Okay' | translate)
                : ('Toolkit.DataRequest.SubmitRequest' | translate)"></button>
      </div>
    </div>`,
  providers: [SubmitAnnouncementService, SubmissionManager]
})
export class DataRequestComponent extends ActivityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<DataRequestComponent>,
    windowRef: WindowRef,
    renderer: Renderer2,
    submitService: SubmitAnnouncementService,
    analytics: AnalyticsEventsService,
    @Inject(DOCUMENT) document: any,
    injector: Injector) {
    super(windowRef, renderer, submitService, analytics, document, injector);
  }

  public submitDataRequest(): void {
    this.flush();
    this.incrementStep(false);
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
