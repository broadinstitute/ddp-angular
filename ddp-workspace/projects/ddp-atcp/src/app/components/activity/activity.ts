import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: `app-activity`,
  styleUrls: ['./activity.scss'],
  template: `
    <div class="activity">
      <app-header></app-header>
      <div class="page-padding content">
        <ddp-activity-redesigned [studyGuid]="studyGuid" [activityGuid]="id"></ddp-activity-redesigned>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class ActivityComponent implements OnInit {
  public studyGuid: string;
  public id: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.activatedRoute.params.subscribe(x => {
      this.id = x.id;
    });
  }
}
