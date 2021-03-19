import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges } from '@angular/core';
import { ActivityInstance } from '../../../../models/activityInstance';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityForm } from '../../../../models/activity/activityForm';
import { EMPTY, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { LoggingService } from '../../../../services/logging.service';
import { ActivitySection } from '../../../../models/activity/activitySection';

@Component({
  selector: 'ddp-embedded-activity-block',
  templateUrl: './embeddedActivityBlock.component.html',
  styleUrls: ['./embeddedActivityBlock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedActivityBlockComponent implements OnInit, OnChanges {
  @Input() instance: ActivityInstance;
  @Input() readonly: boolean;
  @Input() validationRequested: boolean;
  @Input() studyGuid: string;
  @Input() singleSection: boolean;
  @Output() componentBusy = new EventEmitter<boolean>();

  public activity: ActivityForm;
  private readonly LOG_SOURCE = 'EmbeddedActivityBlockComponent';

  constructor(private activityServiceAgent: ActivityServiceAgent,
              private changeDetector: ChangeDetectorRef,
              private logger: LoggingService) { }

  ngOnInit(): void {
    if (this.singleSection) {
      this.componentBusy.emit(true);
    }
    this.getActivity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if we just submitted the form
    if (changes.readonly.currentValue && changes.validationRequested.currentValue
      && !this.singleSection) {
      this.componentBusy.emit(true);
      this.completeActivity();
    }
  }

  public completeActivity(): void {
    this.activityServiceAgent.flushForm(this.studyGuid, this.instance.instanceGuid)
      .pipe(
        catchError(err => {
          this.logger.logError(this.LOG_SOURCE, 'An error during completing an activity', err);
          return EMPTY;
        }),
        take(1))
      .subscribe(() => this.componentBusy.emit(false));
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
