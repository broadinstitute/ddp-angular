import { Translation } from './translation';
import { InstanceStatusType } from './instanceStatusType';

export interface SummaryTranslation extends Translation {
  statusCode: InstanceStatusType;
}
