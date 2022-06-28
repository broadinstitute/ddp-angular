import { ActivityActivityBlock, ActivityBlockType, ActivityRenderHintType } from 'ddp-sdk';
import { ActivityCode } from '../types';

export const isAboutYouOrChildActivity = (activityCode: string): boolean =>
    activityCode === ActivityCode.AboutYou || activityCode === ActivityCode.AboutChild;

export const isActivityBlock = (block: ActivityBlockType): block is ActivityActivityBlock =>
    'activityCode' in block && typeof block.activityCode === 'string';

export const isEnabledModalActivityBlock = (block: ActivityBlockType): boolean =>
    isActivityBlock(block) ? block.enabled && block.renderHint === ActivityRenderHintType.Modal : false;

export const blockInstancesHaveAnswers = (block: ActivityActivityBlock): boolean =>
    block.instances.every(inst => inst.numQuestionsAnswered > 0);

export const activityStatusCodeToNameMap = {
    CREATED: 'Not Started',
    IN_PROGRESS: 'Incomplete',
    COMPLETE: 'Submitted',
};
