import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkflowCommand } from '../../models/workflowCommand';

@Injectable()
export class UrlCommand implements WorkflowCommand {
    constructor(
        @Inject(String) private url: string,
        private router: Router) { }

    public execute(queryParams?: string): Observable<void> {
        const params = queryParams ? `?${queryParams}` : '';
        this.router.navigateByUrl(`${this.url}${params}`);
        // We have navigated away so there's nothing emitted on this observable.
        return new Observable(e => e);
    }
}
