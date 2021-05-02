import { Injectable } from '@angular/core';
import { Auth0AdapterService } from './auth0Adapter.service';
import { LoggingService } from '../logging.service';

@Injectable()
export class Auth0RenewService {
    private readonly LOG_SOURCE = 'Auth0RenewService';

    constructor(
        private adapter: Auth0AdapterService,
        private log: LoggingService) {
    }

    public parseHash(auth0Hash: string): void {
        this.log.logEvent(this.LOG_SOURCE, `Parsing auth0 hash: ${auth0Hash}`);
        this.adapter.webAuth.parseHash(auth0Hash, (err, response) => {
            if (err) {
                this.log.logError(this.LOG_SOURCE, `Error parsing auth0 jwt ${auth0Hash} from hash. Error:`, err);
            } else {
                this.log.logEvent(this.LOG_SOURCE, `Renewed auth: ${response}`);
                this.adapter.setSession(response);
            }
        });
    }
}
