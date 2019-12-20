import { Injectable } from '@angular/core';
import { Auth0AdapterService } from './auth0Adapter.service';
import { LoggingService } from '../logging.service';

@Injectable()
export class Auth0RenewService {
    constructor(
        private adapter: Auth0AdapterService,
        private log: LoggingService) {
    }

    public parseHash(auth0Hash: string): void {
        console.log('parsing auth0 hash ' + auth0Hash);
        this.adapter.webAuth.parseHash(auth0Hash, (err, response) => {
            if (err) {
                console.log('Error parsing auth0 jwt ' + auth0Hash + ' from hash', err);
            } else {
                console.log('Renewed auth', response);
                this.adapter.setSession(response);
            }
        });
    }
}
