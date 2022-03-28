import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivityServiceAgent, SessionMementoService } from 'ddp-sdk';

const USER_GUID = 'PUAXMC6835DKEOHI2B2C'; // an existing Pancan user
const STUDY_GUID = 'cmi-pancan';
const ACTIVITY_GUID = 'H1DHEDGF1A'; // an existing activity for the Pancan user above

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
  parentInstanceGuidFormControl = new FormControl('');
  showActivity: boolean;
  receivedData = new BehaviorSubject('');
  private readonly ngUnsubscribe = new Subject<void>();

  constructor(
    private activityServiceAgent: ActivityServiceAgent,
    private sessionService: SessionMementoService
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

  get allInputsHaveValues(): boolean {
    return [
      this.studyGuidFormControl,
      this.activityGuidFormControl,
      this.activityGuidFormControl
    ].every(control => control.value);
  }

  activityCodeChanged(code: string): void {
    console.log('activityCodeChanged', code);
  }

  navigate($event: any): void {
    console.log('navigate');
  }

  createActivity(): void {
    this.clearResults();

    this.activityServiceAgent.createInstance(
      this.studyGuidFormControl.value,
      this.activityGuidFormControl.value,
      this.parentInstanceGuidFormControl.value
    ).subscribe(data => this.receivedData.next(`Created an instance with activityGuid=${data.instanceGuid}`));
  }

  deleteActivity(): void {
    this.clearResults();

    this.activityServiceAgent.deleteActivityInstance(
      this.studyGuidFormControl.value,
      this.activityGuidFormControl.value
    ).subscribe(() => this.receivedData.next(`Instance with activityGuid=${this.activityGuidFormControl.value} was removed`));
  }

  private clearResults(): void {
    this.showActivity = false;
    this.receivedData.next('');
  }
}
