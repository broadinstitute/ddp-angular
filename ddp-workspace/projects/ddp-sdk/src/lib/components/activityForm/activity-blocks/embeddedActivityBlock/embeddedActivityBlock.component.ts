import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { EMPTY, of } from 'rxjs';
import { catchError, concatMap, finalize, take, tap } from 'rxjs/operators';
import { LoggingService } from '../../../../services/logging.service';
import { ActivitySection } from '../../../../models/activity/activitySection';
import { SubmitAnnouncementService } from '../../../../services/submitAnnouncement.service';

@Component({
  selector: 'ddp-embedded-activity-block',
  templateUrl: './embeddedActivityBlock.component.html',
  styleUrls: ['./embeddedActivityBlock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedActivityBlockComponent implements OnInit {
  @Input() instance: ActivityInstance;
  @Input() readonly: boolean;
  @Input() validationRequested: boolean;
  @Input() studyGuid: string;
  @Input() singleSection: boolean;
  @Output() componentBusy = new EventEmitter<boolean>(true);

  public activity: ActivityForm;
  private readonly LOG_SOURCE = 'EmbeddedActivityBlockComponent';

  constructor(private activityServiceAgent: ActivityServiceAgent,
              private changeDetector: ChangeDetectorRef,
              private submitService: SubmitAnnouncementService,
              private logger: LoggingService) { }

  ngOnInit(): void {
    this.getActivity();
    this.submitService.submitAnnounced$.pipe(
        tap(() => this.componentBusy.emit(true)),
        concatMap(() => this.activityServiceAgent.flushForm(this.studyGuid, this.instance.instanceGuid)),
        catchError(err => {
            this.logger.logError(this.LOG_SOURCE, 'An error during completing an activity', err);
            return EMPTY;
        }),
        take(1),
        finalize(() => this.componentBusy.emit(false))
    ).subscribe();
  }

  public getSectionId(index: number, {name}: ActivitySection): string {
    return `${index}_${name}`;
  }

  private getActivity(): void {
    this.activityServiceAgent.getActivity(of(this.studyGuid), of(this.instance.instanceGuid))
      .pipe(
        catchError(err => {
          this.logger.logError(this.LOG_SOURCE, 'An error during getting a full activity', err);
          return EMPTY;
        }),
        take(1))
      .subscribe((activity: ActivityForm) => {
        this.activity = activity;
        this.changeDetector.detectChanges();
      });
  }
}
