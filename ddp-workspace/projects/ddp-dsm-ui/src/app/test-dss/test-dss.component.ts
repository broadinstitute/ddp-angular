import { Component, OnInit } from '@angular/core';
import { ActivityServiceAgent, SessionMementoService } from 'ddp-sdk';

// https://pepper-dev.datadonationplatform.org/pepper/v1/user/V83QCBFYFLJV4HI57Z6U/studies/cmi-pancan/activities/82D0REQIBC
const userGuid = 'V83QCBFYFLJV4HI57Z6U'; // an existing Pancan user
const studyGuid = 'cmi-pancan';
const activityGuid = '82D0REQIBC'; // an existing activity for the Pancan user above

const existingDSMToken = '';  // PUT HERE your DSM token for debugging locally only! DO NOT PUSH it!
const params = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // eslint-disable-next-line max-len
    Authorization: `Bearer ${existingDSMToken}`
  }
};

@Component({
  selector: 'app-test-dss',
  templateUrl: './test-dss.component.html',
  styleUrls: ['./test-dss.component.scss']
})
export class TestDssComponent implements OnInit {
  studyGuid = studyGuid;
  activityGuid = activityGuid;

  constructor(
    private activityServiceAgent: ActivityServiceAgent,
    private sessionService: SessionMementoService,
  ) { }

  ngOnInit(): void {
    // update DSS session with a current userGuid
    this.sessionService.setParticipant(userGuid);
  }

  createActivity(): void {
    this.activityServiceAgent.createInstance(studyGuid, activityGuid)
      .subscribe({
        next: x => console.log('CREATED', x),
        error: err => console.log('CREATED ERROR', err)
      });
  }

  getActivity(): void {
    this.activityServiceAgent
        .getActivitySummary(studyGuid, activityGuid)
        .subscribe({
          next: res => console.log('GET', res),
          error: err=> console.log('GET ERROR', err),
        });
  }

  fetchActivity(): void {
    const URL = `https://pepper-dev.datadonationplatform.org/pepper/v1/user/${userGuid}/studies/${studyGuid}/activities/${activityGuid}`;

    window.fetch(URL, params)
      .then(res => res.json())
      .then(x => console.log('FETCH', x))
      .catch(err => console.log('FETCH ERR', err));
  }

  // activityCodeChanged(event: any): void {
  //   console.log('activityCodeChanged');
  // }
  //
  // navigate($event: any): void {
  //   console.log('navigate');
  // }
}
