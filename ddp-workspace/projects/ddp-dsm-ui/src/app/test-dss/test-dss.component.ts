import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivityServiceAgent, SessionMementoService } from 'ddp-sdk';

const USER_GUID = '9KS6ZC8G15YZ9ZV8LORZ'; // an existing Pancan user
const STUDY_GUID = 'cmi-pancan';
const ACTIVITY_GUID = '4DWU10NBJ4'; // an existing activity for the Pancan user above

@Component({
  selector: 'app-test-dss',
  templateUrl: './test-dss.component.html',
  styleUrls: ['./test-dss.component.scss']
})
export class TestDssComponent implements OnInit, OnDestroy {
  existingUserGuid = USER_GUID;
  existingStudyGuid = STUDY_GUID;
  existingActivityGuid = ACTIVITY_GUID;

  userGuidFormControl = new FormControl('', [Validators.required]);
  studyGuidFormControl = new FormControl('', [Validators.required]);
  activityGuidFormControl = new FormControl('', [Validators.required]);
  doRequest: boolean;
  private readonly ngUnsubscribe = new Subject<void>();

  constructor(
    private activityServiceAgent: ActivityServiceAgent,
    private sessionService: SessionMementoService,
  ) { }

  ngOnInit(): void {
    this.userGuidFormControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(userIdValue => {
      // update DSS session with a current userGuid
      this.sessionService.setParticipant(userIdValue);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activityCodeChanged(event: any): void {
    console.log('activityCodeChanged');
  }

  navigate($event: any): void {
    console.log('navigate');
  }
}
