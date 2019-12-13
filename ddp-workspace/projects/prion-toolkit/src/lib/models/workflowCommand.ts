import { Observable } from 'rxjs';

export interface WorkflowCommand {
    // The observable should emit once if the command has finished executing
    // and the app has not progressed to a different "stage" of the workflow,
    // i.e. we're still on the same page.
    execute(): Observable<void>;
}
