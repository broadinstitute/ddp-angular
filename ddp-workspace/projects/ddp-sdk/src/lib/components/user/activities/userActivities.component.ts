import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChange,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Inject
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityServiceAgent } from '../../../services/serviceAgents/activityServiceAgent.service';
import { UserActivitiesDataSource } from './userActivitiesDataSource';
import { ActivityInstanceState } from '../../../models/activity/activityInstanceState';
import { LoggingService } from '../../../services/logging.service';
import { UserActivityServiceAgent } from '../../../services/serviceAgents/userActivityServiceAgent.service';
import { ActivityInstanceStatusServiceAgent } from '../../../services/serviceAgents/activityInstanceStatusServiceAgent.service';
import { AnalyticsEventsService } from '../../../services/analyticsEvents.service';
import { AnalyticsEventCategories } from '../../../models/analyticsEventCategories';
import { DashboardColumns } from '../../../models/dashboardColumns';
import { ActivityInstance } from '../../../models/activityInstance';
import { ConfigurationService } from '../../../services/configuration.service';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { tap, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'ddp-user-activities',
  template: `
    <div [hidden]="!loaded">
    <mat-table [dataSource]="dataSource" data-ddp-test="activitiesTable" class="ddp-dashboard">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityName' | translate">
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="padding-5">
          <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityName' | translate"></span>
          <button class="dashboard-activity-button Link"
                [attr.data-ddp-test]="'activityName::' + element.instanceGuid"
                (click)="openActivity(element.instanceGuid, element.activityCode)">
            {{ element.activityName }}
          </button>
        </mat-cell>
      </ng-container>

      <!-- Summary Column -->
      <ng-container matColumnDef="summary">
        <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.Summary' | translate">
        </mat-header-cell>
        <mat-cell *matCellDef="let element"
                  class="padding-5"
                  [attr.data-ddp-test]="'activitySummary::' + element.instanceGuid" >
          <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.Summary' | translate"></span>
          {{ element.activitySummary }}
        </mat-cell>
      </ng-container>

      <!-- Date Column -->
      <ng-container matColumnDef="date">
        <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityDate' | translate">
        </mat-header-cell>
        <mat-cell *matCellDef="let element"
                  class="padding-5"
                  [attr.data-ddp-test]="'activityDate::' + element.createdAt">
          <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityDate' | translate"></span>
          {{ element.createdAt | date: 'MM/dd/yyyy' }}
        </mat-cell>
      </ng-container>

      <!-- Status Column -->
      <ng-container matColumnDef="status">
        <mat-header-cell class="padding-5" *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate">
        </mat-header-cell>
        <mat-cell *matCellDef="let element"
                  class="padding-5"
                  [attr.data-ddp-test]="'activityStatus::' + element.instanceGuid">
            <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityStatus' | translate"></span>
            <div class="dashboard-status-container" [ngClass]="{'dashboard-status-container_summary': showSummary(element)}">
              <ng-container *ngIf="element.icon">
                <img class="dashboard-status-container__img" [attr.src]="domSanitizationService.bypassSecurityTrustUrl('data:image/svg+xml;base64,' + element.icon)">
              </ng-container>
              <ng-container *ngIf="showQuestionCount(element)">
                {{ 'SDK.UserActivities.ActivityQuestionCount' | translate: { 'questionsAnswered': element.numQuestionsAnswered, 'questionTotal': element.numQuestions } }}
              </ng-container>
              <ng-container *ngIf="showSummary(element)">
                {{ element.activitySummary }}
              </ng-container>
              <ng-container *ngIf="!showQuestionCount(element) && !showSummary(element)">
                {{ getState(element.statusCode) }}
              </ng-container>
            </div>
        </mat-cell>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></mat-header-cell>
        <mat-cell *matCellDef="let element"
                  [attr.data-ddp-test]="'activityActions::' + element.readonly">
          <span class="dashboard-mobile-label" [innerHTML]="'SDK.UserActivities.ActivityActions' | translate"></span>
          <button *ngIf="!element.readonly"
                  class="ButtonFilled Button--cell button button_small button_primary"
                  (click)="openActivity(element.instanceGuid, element.activityCode)"
                  [innerHTML]="getButtonTranslate(element) | translate">
          </button>
          <button *ngIf="element.readonly"
                  class="ButtonBordered ButtonBordered--orange Button--cell button button_small button_secondary"
                  (click)="openActivity(element.instanceGuid, element.activityCode)"
                  [innerHTML]="'SDK.ReviewButton' | translate">
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </mat-table>
  </div>`,
  styles: [`
      .mat-row {
          min-height: auto;
          padding: 5px 0;
      }

      .mat-cell,
      .mat-header-cell,
      .dashboard-mobile-label {
        font-size: 0.9rem;
      }

      .mat-column-summary {
        flex: 0 0 35%;
      }

      .mat-cell {
        display: flex;
        align-items: center;
        overflow: unset;
        min-height: auto;
      }

      .dashboard-mobile-label {
        display: none;
      }

      .dashboard-status-container {
        display: flex;
        align-items: center;
      }

      .dashboard-status-container__img {
        height: 36px;
        width: 36px;
      }

      .padding-5 {
        padding: 0 5px 0 0;
      }

      @media(max-width: 650px) {
        .mat-cell {
          align-items: flex-start;
          padding: 0 0 12px 0;
        }

        .mat-header-row {
          display: none;
        }

        .mat-column-status {
          align-items: center;
        }

        .mat-row {
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 0 0 0;
        }

        .mat-row::after {
          display: none;
        }

        .dashboard-mobile-label {
          min-width: 75px;
          display: inline-block;
        }
      }
    `]
})
export class UserActivitiesComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input() studyGuid: string;
  @Input() displayedColumns: Array<DashboardColumns> = ['name', 'summary', 'date', 'status', 'actions'];
  @Output() open: EventEmitter<string> = new EventEmitter();
  @Output() loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dataSource: UserActivitiesDataSource;
  public loaded = false;
  private states: Array<ActivityInstanceState> | null = null;
  private studyGuidObservable: BehaviorSubject<string | null>;
  private loadingAnchor: Subscription;

  constructor(
    private serviceAgent: UserActivityServiceAgent,
    private statusesServiceAgent: ActivityInstanceStatusServiceAgent,
    private logger: LoggingService,
    private activityServiceAgent: ActivityServiceAgent,
    private analytics: AnalyticsEventsService,
    @Inject('ddp.config') private config: ConfigurationService,
    public domSanitizationService: DomSanitizer) {
    this.studyGuidObservable = new BehaviorSubject<string | null>(null);
  }

  public ngOnInit(): void {
    this.dataSource = new UserActivitiesDataSource(
      this.serviceAgent,
      this.logger,
      this.studyGuidObservable);
    this.loadingAnchor =
      this.statusesServiceAgent
        // lets get Observable for status list
        .getStatuses().pipe(
          tap(x => this.states = x),
          // than we will intersect this observable with 'isNull'
          // observable stream from main data source, so we will get
          // single final result when both statuses and activity
          // instances will be loaded
          mergeMap(x => this.dataSource.isNull)
          // here is the final subscription, on which we will update
          // 'loaded' flag
        ).subscribe(x => {
          this.loaded = !x;
          this.loadedEvent.emit(this.loaded);
        });
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const propName in changes) {
      if (propName === 'studyGuid') {
        this.logger.logEvent('UserActivitiesComponent', `studyChanged: ${this.studyGuid}`);
        this.studyGuidObservable.next(this.studyGuid);
      }
    }
  }

  public ngAfterContentInit(): void {
    this.doAnalytics('opened');
  }

  public ngOnDestroy(): void {
    this.loadingAnchor.unsubscribe();
    this.loadedEvent.emit(false);
  }

  public openActivity(guid: string, code: string): void {
    const response$ = this.isReportActivity(code) ? this.activityServiceAgent.flushForm(this.config.studyGuid, guid) : of(null);
    response$.pipe(
      take(1)
    ).subscribe(() => {
      this.logger.logEvent('UserActivitiesComponent', `Activity clicked: ${guid}`);
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
    } else if (activityInstance.statusCode === 'COMPLETE' && activityInstance.numQuestions === activityInstance.numQuestionsAnswered) {
      return false;
    } else {
      return true;
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
    if (this.config.dashboardSummaryInsteadOfStatus.includes(activityInstance.activityCode) && activityInstance.activitySummary) {
      return true;
    } else {
      return false;
    }
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
