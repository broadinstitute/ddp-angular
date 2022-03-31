import { ActivityContentBlock } from './activityContentBlock';
import { ActivityQuestionBlock } from './activityQuestionBlock';
import { ActivityInstitutionBlock } from './activityInstitutionBlock';
import { ActivityActivityBlock } from './activityActivityBlock';

export type ActivityBlockType = ActivityContentBlock | ActivityQuestionBlock<any> | ActivityInstitutionBlock | ActivityActivityBlock;
