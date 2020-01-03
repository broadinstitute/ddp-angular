import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { take } from 'rxjs/operators';
import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';

// Need to hold off on this expression for now until https://broadinstitute.atlassian.net/browse/DDP-4311 is fixed
// const EMAIL_REGEXP =
// /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// Expression being used in server to test email format
export const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

const TRANSLATION_KEYS = ['SDK.EmailEntry.InvalidEmail'];

export class ActivityEmailValidatorRule extends ActivityAbstractValidationRule {
  private emailFormatErrorMessage: string;

  constructor(
    question: ActivityTextQuestionBlock, translate: NGXTranslateService) {
    super(question);
    translate.getTranslation(TRANSLATION_KEYS
    )
      .pipe(take(1))
      .subscribe((vals) => {
        this.emailFormatErrorMessage = vals[TRANSLATION_KEYS[0]];
      });
  }

  recalculate(): boolean {
    this.result = null;
    const email = this.textEmailBlock().answer;
    const confirmation = this.textEmailBlock().confirmationValue;
    if (!email && !confirmation) {
      return true;
    } else if ((this.textEmailBlock().confirmEntry && !email || !confirmation)) {
      this.result = this.textEmailBlock().mismatchMessage;
      return false;
    } else if (this.textEmailBlock().confirmEntry && email !== confirmation) {
      this.result = this.textEmailBlock().mismatchMessage;
      return false;
    } else if (!EMAIL_REGEXP.test(email) || !EMAIL_REGEXP.test(confirmation)) {
      this.result = this.emailFormatErrorMessage;
      return false;
    } else {
      return true;
    }
  }

  private textEmailBlock(): ActivityTextQuestionBlock {
    return this.question as ActivityTextQuestionBlock;
  }

}
