import {
  AfterContentInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, of, Subscription, take } from 'rxjs';
import {
  ActivityInstance,
  ActivityInstanceState,
  ActivityInstanceStatusServiceAgent,
  ActivityServiceAgent,
  AnalyticsEventCategories,
  AnalyticsEventsService,
  ConfigurationService,
  DashboardColumns,
  LoggingService,
} from 'ddp-sdk';
import { activityStatusCodeToNameMap } from '../../utils';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input() studyGuid: string;
  @Input() dataSource: Array<ActivityInstance>;
  @Input() displayedColumns: Array<DashboardColumns> = ['name', 'summary', 'date', 'status', 'actions'];
  @Output() open: EventEmitter<string> = new EventEmitter();
  @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public statusesLoaded = false;
  private states: Array<ActivityInstanceState> | null = null;
  private studyGuidObservable = new BehaviorSubject<string | null>(null);
  private statusesLoadingAnchor: Subscription;
  private readonly LOG_SOURCE = 'UserActivitiesComponent';

  constructor(
      private statusesServiceAgent: ActivityInstanceStatusServiceAgent,
      private logger: LoggingService,
      private activityServiceAgent: ActivityServiceAgent,
      private analytics: AnalyticsEventsService,
      @Inject('ddp.config') private config: ConfigurationService,
      public domSanitizationService: DomSanitizer) {}

  public ngOnInit(): void {
      this.statusesLoadingAnchor = this.statusesServiceAgent.getStatuses()
          .subscribe((x) => {
              this.states = x.map(({ code, name }) => ({ code, name: activityStatusCodeToNameMap[code] ?? name }));
              this.statusesLoaded = true;
              this.loadedEvent.emit(true);
          });
  }

  public ngOnChanges(changes: SimpleChanges): void {
      if (changes['studyGuid']) {
          this.logger.logEvent(this.LOG_SOURCE, `studyChanged: ${this.studyGuid}`);
          this.studyGuidObservable.next(this.studyGuid);
      }
  }

  public ngAfterContentInit(): void {
      this.doAnalytics('opened');
  }

  public ngOnDestroy(): void {
      this.statusesLoadingAnchor.unsubscribe();
      this.loadedEvent.emit(false);
  }

  public openActivity(guid: string, code: string): void {
      const response$ = this.isReportActivity(code) ? this.activityServiceAgent.flushForm(this.config.studyGuid, guid) : of(null);
      response$.pipe(
          take(1)
      ).subscribe(() => {
          this.logger.logEvent(this.LOG_SOURCE, `Activity clicked: ${guid}`);
          this.doAnalytics(code);
          this.open.emit(guid);
      });
  }

  public getState(code: string): string {
      if (this.states === null) {
          return code;
      }
      const caption = this.states.find(x => x.code === code);
      return caption != null ? caption.name : '';
  }

  public showQuestionCount(activityInstance: ActivityInstance): boolean {
      if (!this.config.dashboardShowQuestionCount ||
          this.config.dashboardShowQuestionCountExceptions.includes(activityInstance.activityCode)) {
          return false;
      } else if (activityInstance.numQuestions === 0) {
          return false;
      } else {
          return !(activityInstance.statusCode === 'COMPLETE' && activityInstance.numQuestions === activityInstance.numQuestionsAnswered);
      }
  }

  public isActivityCompleted(statusCode: string): boolean {
      return this.config.dashboardActivitiesCompletedStatuses.includes(statusCode);
  }

  public isNewActivity(statusCode: string): boolean {
      return this.config.dashboardActivitiesStartedStatuses.includes(statusCode);
  }

  public isReportActivity(activityCode: string): boolean {
      return this.config.dashboardReportActivities.includes(activityCode);
  }

  public showSummary(activityInstance: ActivityInstance): boolean {
      return !!(this.config.dashboardSummaryInsteadOfStatus.includes(activityInstance.activityCode) && activityInstance.activitySummary);
  }

  public getButtonTranslate(activityInstance: ActivityInstance): string {
      if (this.isActivityCompleted(activityInstance.statusCode)) {
          return 'SDK.CompleteButton';
      } else if (this.isReportActivity(activityInstance.activityCode)) {
          return 'SDK.OpenButton';
      } else if (this.showSummary(activityInstance)) {
          return 'SDK.ReportButton';
      } else if (this.isNewActivity(activityInstance.statusCode)) {
          return 'SDK.StartButton';
      } else {
          return 'SDK.EditButton';
      }
  }

  private doAnalytics(action: string): void {
      this.analytics.emitCustomEvent(AnalyticsEventCategories.Dashboard, action);
  }
}
