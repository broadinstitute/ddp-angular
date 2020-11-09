import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import { ActivityService } from '../../services/activity.service';
import { MultiGovernedUserService } from '../../services/multi-governed-user.service';
import * as RouterResources from '../../router-resources';

@Component({
  selector: 'atcp-activity-redirect',
  template: '',
})
export class ActivityRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService,
    private multiGovernedUserService: MultiGovernedUserService
  ) {}

  ngOnInit(): void {
    const instanceGuid = this.route.snapshot.params.instanceGuid;

    if (instanceGuid) {
      this.activityService.currentActivityInstanceGuid = instanceGuid;
      this.router.navigateByUrl(RouterResources.Survey);
    } else {
      this.multiGovernedUserService.isMultiGoverned$
        .pipe(
          filter(isMultiGoverned => isMultiGoverned !== null),
          take(1)
        )
        .subscribe(isMultiGoverned => {
          this.router.navigateByUrl(
            isMultiGoverned
              ? RouterResources.ParticipantList
              : RouterResources.Dashboard
          );
        });
    }
  }
}
