import { DataSource } from '@angular/cdk/collections';
import { ActivityInstance } from '../../../models/activityInstance';
import { LoggingService } from '../../../services/logging.service';
import { UserActivityServiceAgent } from '../../../services/serviceAgents/userActivityServiceAgent.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class UserActivitiesDataSource extends DataSource<ActivityInstance> {
    constructor(
        private serviceAgent: UserActivityServiceAgent,
        private logger: LoggingService,
        private study: Observable<string | null>) {
        super();
    }

    public connect(): Observable<Array<ActivityInstance>> {
        return this.serviceAgent.getActivities(this.study).pipe(
            map(x => {
                if (x == null) {
                    return [] as Array<ActivityInstance>;
                } else {
                    return x;
                }
            })
        );
    }

    public disconnect(): void { }
}
