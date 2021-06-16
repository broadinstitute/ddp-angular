import { Workflow } from './Workflow';
import { WorkflowKey } from '../constants/workflow-key';

export interface StudyMessageConfiguration {
  workflowKey: WorkflowKey;
  condition: (workflow: Workflow) => boolean;
  additionalCondition?: (workflows: Workflow[]) => boolean;
  dateWorkflowKey?: WorkflowKey;
  baseKey: string;
  stageKey: string;
  exclusive?: boolean;
  group: number;
}
