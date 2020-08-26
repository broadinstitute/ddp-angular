import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../../services/configuration.service';
import { LoggingService } from '../../../services/logging.service';
import { UserActivityServiceAgent } from '../../../services/serviceAgents/userActivityServiceAgent.service';
import { ActivityServiceAgent } from '../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityInstanceGuid } from '../../../models/activityInstanceGuid';
import { Observable, Subject  } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ddp-new-activity-in-modal',
  template: `
    <ng-container *ngIf="this.data.modalName === 'DataRequestModalComponent'">
      <ddp-data-request-modal [studyGuid]="studyGuid"
                              [activityGuid]="(activityInstance$ | async)?.instanceGuid">
      </ddp-data-request-modal>
    </ng-container>
  `
})
export class NewActivityInModalComponent implements OnInit, OnDestroy {
  public studyGuid: string;
  public activityInstance$: Observable<ActivityInstanceGuid | null>;
  private activityGuid: string;
  // used as notifier to trigger completions
  // https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
  // this could be overkill, but has nice property that actually trigger the onComplete
  // call on subscribe, so you can be sure it has been cleaned up.
  // | async subscriptions are cleaned up by Angular
  private ngUnsubscribe = new Subject();

  constructor(
    public dialogRef: MatDialogRef<NewActivityInModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private serviceAgent: ActivityServiceAgent,
    private userActivityServiceAgent: UserActivityServiceAgent,
    private router: Router,
    private logger: LoggingService,
    @Inject('ddp.config') private configuration: ConfigurationService) {
    this.activityGuid = this.data.activityGuid;
    const createActivityInstance: boolean = !!(this.data.createActivityInstance);
    this.studyGuid = this.configuration.studyGuid;
    // new activity instance is created at each modal launch
    if (createActivityInstance) {
      const newActivityInstance$: Observable<ActivityInstanceGuid | null> = this.serviceAgent
      .createInstance(this.studyGuid, this.activityGuid).pipe(
        map(x => {
          if (x) {
            return x;
          } else {
            this.logger.logError('Could not create the activity instance for study activity guid:' + this.activityGuid,
              'Creating new activity instance in modal');
            return null;
          }
        }));

        this.activityInstance$ = newActivityInstance$.pipe(share());
    }
  }

  public ngOnInit(): void {
    this.activityInstance$.pipe(
      takeUntil(this.ngUnsubscribe))
    .subscribe(activityInstance => {
      if (!activityInstance) {
        this.dialogRef.close();
        this.router.navigateByUrl(this.configuration.errorPageUrl);
      }
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
