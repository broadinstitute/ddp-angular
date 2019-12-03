import { ActivityQuestionBlock } from './activityQuestionBlock';
import { ActivityAbstractValidationRule } from '../../services/activity/validators/activityAbstractValidationRule';

export type ValidationRuleFactory = (validationJson: any, questionBlock: ActivityQuestionBlock<any>) => ActivityAbstractValidationRule;
