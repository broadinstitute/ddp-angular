import { ActivityInstance } from 'ddp-sdk';
import { ActivityCode } from '../constants/activity-code';
import { BlockStableId } from '../constants/block-stable-id';


export interface SimpleActivityQuestionBlock {
  _answer: string;
  stableId: string;
}

export const getReleaseRequestTitle = (activityInstance: ActivityInstance, blocks: SimpleActivityQuestionBlock[]): string => {
  switch (activityInstance.activityCode) {
    case ActivityCode.ReleaseRequestClinical:
      return blocks.find(
        (block: SimpleActivityQuestionBlock) => block.stableId === BlockStableId.RRC_PROVIDER_NAME
      )?._answer || activityInstance.activityName;
    case ActivityCode.ReleaseRequestGenetic:
      return blocks.find(
        (block: SimpleActivityQuestionBlock) => block.stableId === BlockStableId.RRG_LAB_NAME
      )?._answer || activityInstance.activityName;
    default:
      return null;
  }
};
