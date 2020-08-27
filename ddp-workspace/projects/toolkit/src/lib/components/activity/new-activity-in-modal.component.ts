import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { LoggingService, UserActivityServiceAgent, ActivityServiceAgent, ActivityInstanceGuid } from 'ddp-sdk';
import { Observable, Subject  } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'toolkit-new-activity-in-modal',
  template: `
    <toolkit-data-request-activity *ngIf="this.data.modalName === 'DataRequestComponent'"
                                [studyGuid]="studyGuid"
                                [activityGuid]="(activityInstance$ | async)?.instanceGuid">
    </toolkit-data-request-activity>
  `
})
export class NewActivityInModalComponent implements OnInit, OnDestroy {
  public studyGuid: string;
  public activityInstance$: Observable<ActivityInstanceGuid | null>;
  private activityGuid: string;
  private ngUnsubscribe = new Subject();

  constructor(
    public dialogRef: MatDialogRef<NewActivityInModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private serviceAgent: ActivityServiceAgent,
    private userActivityServiceAgent: UserActivityServiceAgent,
    private router: Router,
    private logger: LoggingService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) {
    this.activityGuid = this.data.activityGuid;
    const createActivityInstance: boolean = !!(this.data.createActivityInstance);
    this.studyGuid = this.config.studyGuid;
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
        this.router.navigateByUrl(this.config.errorUrl);
      }
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
