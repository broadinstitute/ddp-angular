import { ActivityTextQuestionBlock } from './activityTextQuestionBlock';
import { ActivityEmailValidatorRule } from '../../services/activity/validators/activityEmailValidatorRule';

export class ActivityEmailQuestionBlock extends ActivityTextQuestionBlock {
  public email: string | null;
  public emailConfirmation: string | null;
  constructor() {
    super();
    this.validators.push(new ActivityEmailValidatorRule(this));
  }

  get answer(): string | null {
    return this.email;
  }

  set answer(value: string | null) {
    this.email = this.emailConfirmation = value;
    this.validate();
  }

  setAnswer(value: string | null, doValidation: boolean = true): void {
    this.email = this.emailConfirmation = value;
    doValidation && this.validate();
  }
}
