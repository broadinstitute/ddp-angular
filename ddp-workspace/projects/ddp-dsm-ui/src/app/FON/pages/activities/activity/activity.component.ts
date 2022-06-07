import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {SessionMementoService} from 'ddp-sdk';

@Component({
  selector: 'app-activity',
  template: `
    <ddp-activity-redesigned studyGuid='fon'
                             [activityGuid]='activityGuid'
                             (submit)='navigate($event)'
                             (activityCode)='activityCodeChanged($event)'>
    </ddp-activity-redesigned>
  `,
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit {
  activityGuid: string;

  constructor(private router: ActivatedRoute, private sessionService: SessionMementoService) {
  }

  ngOnInit(): void {
    this.router.params.subscribe((param: Params) => {
      this.activityGuid = param.activity;
    });

    this.router.parent.params.subscribe((param: Params) => {
      this.sessionService.setParticipant(param.guid);
    });
  }

  navigate(event: any): void {
    console.log(event);
  }

  activityCodeChanged(code: string): void {
    console.log('activityCodeChanged', code);
  }
}
