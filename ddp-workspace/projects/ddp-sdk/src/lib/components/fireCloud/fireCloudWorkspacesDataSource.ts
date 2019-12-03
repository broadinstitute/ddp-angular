import { FireCloudWorkspace } from '../../models/fireCloudWorkspace';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { LoggingService } from '../../services/logging.service';
import { FireCloudServiceAgent } from '../../services/serviceAgents/fireCloudServiceAgent.service';

export class FireCloudWorkspacesDataSource extends DataSource<FireCloudWorkspace> {
    constructor(
        private serviceAgent: FireCloudServiceAgent,
        private logger: LoggingService) {
        super();
    }

    public connect(): Observable<Array<FireCloudWorkspace>> {
        this.logger.logEvent('FireCloudWorkspacesDataSource', 'querying workspaces');

        return this.serviceAgent.getWorkspaces();
    }

    public disconnect(): void { }
}
