import { Study } from '../../models/study';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { LoggingService } from '../../services/logging.service';
import { FireCloudServiceAgent } from '../../services/serviceAgents/fireCloudServiceAgent.service';

export class FireCloudStudiesDataSource extends DataSource<Study> {
    private readonly LOG_SOURCE = 'FireCloudStudiesDataSource';

    constructor(
        private serviceAgent: FireCloudServiceAgent,
        private logger: LoggingService) {
        super();
    }

    public connect(): Observable<Array<Study>> {
        this.logger.logEvent(this.LOG_SOURCE, 'querying studies');

        return this.serviceAgent.getStudies();
    }

    public disconnect(): void { }
}
