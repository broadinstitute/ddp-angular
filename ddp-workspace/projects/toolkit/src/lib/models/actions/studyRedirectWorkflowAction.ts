import { WorkflowAction } from './workflowAction';
import { WorkflowActionType } from '../workflowActionType';
import { StudyRedirectResponse } from '../studyRedirectResponse';

export class StudyRedirectWorkflowAction implements WorkflowAction {
    public actionType = WorkflowActionType.STUDY_REDIRECT;

    constructor(public data: StudyRedirectResponse) {}
}
