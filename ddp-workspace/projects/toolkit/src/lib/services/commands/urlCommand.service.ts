import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkflowCommand } from '../../models/workflowCommand';

@Injectable()
export class UrlCommand implements WorkflowCommand {
    constructor(
        private url: string,
        private router: Router) { }

    public execute(): Observable<void> {
        this.router.navigateByUrl(this.url);
        // We have navigated away so there's nothing emitted on this observable.
        return new Observable(e => e);
    }
}
