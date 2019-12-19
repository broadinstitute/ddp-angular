import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityEmailQuestionBlock } from '../../../models/activity/activityEmailQuestionBlock';

const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export class ActivityEmailValidatorRule extends ActivityAbstractValidationRule {
  constructor(
    question: ActivityEmailQuestionBlock){
    super(question);
  }
  recalculate(): boolean {
    this.result = null;
    const email = this.emailBlock().email;
    const confirmation = this.emailBlock().emailConfirmation;
    if (!email && !confirmation) {
      return true;
    } else if ((!email || !confirmation)) {
      // @todo internationalize messages
      this.result = 'Please re-enter email address';
      return false;
    } else if (email !== confirmation) {
      this.result = 'Email addresses need to match';
      return false;
    } else if (!EMAIL_REGEXP.test(this.emailBlock().email) || !EMAIL_REGEXP.test(this.emailBlock().emailConfirmation)) {
      this.result = 'The email addresses entered have an incorrect format';
      return false;
    } else {
      return true;
    }
  }
  private emailBlock(): ActivityEmailQuestionBlock {
    return this.question as ActivityEmailQuestionBlock;
  }

}
