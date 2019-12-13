import { WorkflowAction } from './workflowAction';
import { WorkflowActionType } from './../workflowActionType';

export class MailingListWorkflowAction implements WorkflowAction {
    public actionType = WorkflowActionType.MAILING_LIST;
}
