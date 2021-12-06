import { BlockVisibility } from './blockVisibility';
import { ActivityInstanceGuid } from '../activityInstanceGuid';

export interface CreateActivityInstanceResponse extends ActivityInstanceGuid {
  /**
   * `blockVisibility` is present when we are creating a nested activity instance
   */
  blockVisibility?: BlockVisibility[];
}
