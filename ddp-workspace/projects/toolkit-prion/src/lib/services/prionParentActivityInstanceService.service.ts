import { Injectable } from '@angular/core';

import { ActivityInstance, UserActivityServiceAgent, ActivityServiceAgent } from 'ddp-sdk';
import { Observable } from 'rxjs';

@Injectable()
export class PrionParentActivityInstanceService {
    constructor(private userActivityServiceAgent: UserActivityServiceAgent,
                private activityServiceAgent: ActivityServiceAgent) {}

    public getParentInstance(instance: ActivityInstance, studyGuid: string): Observable<ActivityInstance> {
        return this.activityServiceAgent.getActivitySummary(studyGuid, instance.parentInstanceGuid);
    }

}
