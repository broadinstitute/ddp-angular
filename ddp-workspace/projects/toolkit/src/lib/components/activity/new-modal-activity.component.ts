import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { LoggingService, UserActivityServiceAgent, ActivityServiceAgent, ActivityInstanceGuid } from 'ddp-sdk';
import { Observable, Subject  } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'toolkit-new-modal-activity',
  template: `
    <toolkit-modal-activity [studyGuid]="config.studyGuid"
                            [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                            [data]="data.activityDetails">
    </toolkit-modal-activity>
  `
})
export class NewModalActivityComponent implements OnInit, OnDestroy {
  public activityInstance$: Observable<ActivityInstanceGuid | null>;
  private ngUnsubscribe = new Subject();

  constructor(
    public dialogRef: MatDialogRef<NewModalActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private serviceAgent: ActivityServiceAgent,
    private userActivityServiceAgent: UserActivityServiceAgent,
    private router: Router,
    private logger: LoggingService,
    @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
      this.createActivityInstance();
  }

  private createActivityInstance(): void {
    this.activityInstance$ = this.serviceAgent
    .createInstance(this.config.studyGuid, this.data.activityGuid).pipe(
      map(x => {
        if (x) {
          return x;
        } else {
          this.logger.logError('Could not create the activity instance for study activity guid:'
            + this.data.activityGuid, 'Creating new activity instance in modal');
          return null;
        }
      }))
    .pipe(share());
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
