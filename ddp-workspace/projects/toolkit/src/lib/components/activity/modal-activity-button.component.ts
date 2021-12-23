import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import {
  ActivityInstanceGuid,
  ActivityServiceAgent,
  LoggingService,
  SessionMementoService
} from 'ddp-sdk';
import { map, share, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'toolkit-modal-activity-button',
  template: `
    <button (click)="createActivityInstance()"
            class="Button NewActivityButton"
            [disabled]="!isAuthenticated"
            [attr.data-tooltip]="disabledTooltip | translate"
            [innerText]="buttonText | translate">
    </button>
    <ng-template #modal let-data>
      <toolkit-modal-activity [studyGuid]="this.config.studyGuid"
                              [activityGuid]="this.instanceGuid.getValue()"
                              [data]="data"></toolkit-modal-activity>
    </ng-template>
  `
})
export class ModalActivityButtonComponent implements OnInit, OnDestroy {
  @Input() disabledTooltip: string;
  @Input() buttonText: string;
  public isAuthenticated: boolean;

  // data for new activity instance
  @Input() activityGuid: string;
  @Input() nextButtonText: string;
  @Input() prevButtonText: string;
  @Input() submitButtonText: string;
  @Input() showFinalConfirmation: boolean;
  @Input() confirmationButtonText: string;

  public instanceGuid = new BehaviorSubject(null);
  public activityInstance$: Observable<ActivityInstanceGuid | null>;
  private ngUnsubscribe = new Subject<void>();
  private anchor: Subscription = new Subscription();
  private readonly LOG_SOURCE = 'ModalActivityButtonComponent';
  @ViewChild('modal', { static: true }) private modalRef: TemplateRef<any>;

  constructor(public dialog: MatDialog,
              private session: SessionMementoService,
              private serviceAgent: ActivityServiceAgent,
              private router: Router,
              private logger: LoggingService,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  public ngOnInit(): void {
    const activityInstanceGuide$ = this.instanceGuid.subscribe(x => {
      if (x) {
        this.openModal();
      }
    });
    this.anchor.add(activityInstanceGuide$);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.anchor.unsubscribe();
  }

  public createActivityInstance(): void {
    this.activityInstance$ = this.serviceAgent
      .createInstance(this.config.studyGuid, this.activityGuid).pipe(
        map(x => {
          if (x) {
            this.instanceGuid.next(x.instanceGuid);
            return x;
          } else {
            this.logger.logError(`${this.LOG_SOURCE}.Could not create the activity instance for study activity guid: ${this.activityGuid}`,
              'Creating new activity instance in modal');
            return null;
          }
        }))
      .pipe(share());

    this.activityInstance$.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(activityInstance => {
        if (!activityInstance) {
          this.dialog.closeAll();
          this.router.navigateByUrl(this.config.errorUrl);
        }
      });
  }

  private openModal(): void {
    this.dialog.open(this.modalRef, {
      data: {
        nextButtonText: this.nextButtonText,
        prevButtonText: this.prevButtonText,
        submitButtonText: this.submitButtonText,
        showFinalConfirmation: this.showFinalConfirmation,
        confirmationButtonText: this.confirmationButtonText
      },
      width: '740px',
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
