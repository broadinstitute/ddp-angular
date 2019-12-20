import { ActivityTextQuestionBlock } from './activityTextQuestionBlock';

export class ActivityEmailQuestionBlock extends ActivityTextQuestionBlock {
  public email: string | null = null;
  public emailConfirmation: string | null = null;
  constructor() {
    super();
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
