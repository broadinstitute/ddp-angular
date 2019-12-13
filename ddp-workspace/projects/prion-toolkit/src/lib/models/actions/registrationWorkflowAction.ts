import { WorkflowAction } from './workflowAction';
import { WorkflowActionType } from '../workflowActionType';

export class RegistrationWorkflowAction implements WorkflowAction {
    public actionType = WorkflowActionType.REGISTRATION;
}
