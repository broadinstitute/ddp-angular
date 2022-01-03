import { BlockVisibility } from './blockVisibility';

export interface DeleteActivityInstanceResponse {
  /**
   * `blockVisibility` is present if we are deleting a nested activity instance
   */
  blockVisibility?: BlockVisibility[];
}
