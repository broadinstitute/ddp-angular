import { WorkflowAction } from './workflowAction';
import { WorkflowActionType } from './../workflowActionType';

export class UrlWorkflowAction implements WorkflowAction {
    public actionType = WorkflowActionType.URL;

    constructor(
        public url: string) { }
}
