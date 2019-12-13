import { WorkflowCommand } from './workflowCommand';
import { WorkflowAction } from './../models/actions/workflowAction';

export interface WorkflowRule {
    type: string;
    func: (action: WorkflowAction) => WorkflowCommand;
}
