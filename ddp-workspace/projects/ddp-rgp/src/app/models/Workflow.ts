import { WorkflowData } from './WorkflowData';

export interface Workflow {
  workflow: string;
  status: string;
  date: string;
  data?: WorkflowData;
}
