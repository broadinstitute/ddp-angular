import { ActivityStatusCodes } from 'ddp-sdk';


export interface ActivityListItem {
  activityCode?: string;
  activityNameI18nKey: string;
  status?: ActivityStatusCodes;
}
