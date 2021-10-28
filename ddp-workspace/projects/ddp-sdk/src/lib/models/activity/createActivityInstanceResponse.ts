import { BlockVisibility } from './blockVisibility';

export interface CreateActivityInstanceResponse {
  instanceGuid: string;
  /**
   * `blockVisibility` is present when we are creating a nested activity instance
   */
  blockVisibility?: BlockVisibility[];
}
