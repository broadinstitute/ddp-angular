import { DataSource } from '@angular/cdk/collections';
import { ActivityInstance } from '../../../models/activityInstance';
import { LoggingService } from '../../../services/logging.service';
import { UserActivityServiceAgent } from '../../../services/serviceAgents/userActivityServiceAgent.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class UserActivitiesDataSource extends DataSource<ActivityInstance> {
    private nullSource: BehaviorSubject<boolean | null>;

    constructor(
        private serviceAgent: UserActivityServiceAgent,
        private logger: LoggingService,
        private study: Observable<string | null>) {
        super();
        this.nullSource = new BehaviorSubject<boolean | null>(null);
    }

    public get isNull(): Observable<boolean | null> {
        return this.nullSource.asObservable();
    }

    public connect(): Observable<Array<ActivityInstance>> {
        return this.serviceAgent.getActivities(this.study).pipe(
            map(x => {
                if (x == null) {
                    return new Array<ActivityInstance>();
                } else {
                    return x;
                }
            })
        );
    }

    public disconnect(): void { }
}
