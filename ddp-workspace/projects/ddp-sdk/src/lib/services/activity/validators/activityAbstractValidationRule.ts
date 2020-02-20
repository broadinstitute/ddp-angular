import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';

export abstract class ActivityAbstractValidationRule {
  /**
   * The message associated with the rule
   */
  public message: string;
  /**
   * The result of evaluating the validation rule. null value if validation passes
   */
  public result: string | null;
  /**
   * Flag to indicate whether a data save should be allowed to proceed if validation fails.
   * Value of false means data save should not be allowed. Value of true means save even if validation rule fails
   */
  public allowSave = false;

  constructor(public question: ActivityQuestionBlock<any>) { }

  public abstract recalculate(): boolean;
}
