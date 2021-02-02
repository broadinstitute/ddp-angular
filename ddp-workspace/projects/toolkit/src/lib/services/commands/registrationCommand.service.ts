import { Injectable } from '@angular/core';
import { WorkflowCommand } from '../../models/workflowCommand';
// import { Auth0AdapterService } from 'ddp-sdk';
import {Auth0AdapterService} from "../../../../../ddp-sdk/src/lib/services/authentication/auth0Adapter.service";
import { Observable } from 'rxjs';

@Injectable()
export class RegistrationCommand implements WorkflowCommand {
    constructor(private auth0: Auth0AdapterService) { }

    public execute(): Observable<void> {
        this.auth0.signup();
        return new Observable(e => e);
    }
}
