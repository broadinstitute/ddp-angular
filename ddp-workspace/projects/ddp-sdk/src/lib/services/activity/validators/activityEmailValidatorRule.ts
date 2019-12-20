import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityEmailQuestionBlock } from '../../../models/activity/activityEmailQuestionBlock';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { take } from 'rxjs/operators';

// Need to hold off on this expression for now until https://broadinstitute.atlassian.net/browse/DDP-4311 is fixed
// const EMAIL_REGEXP =
   // /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;
const TRANSLATION_KEYS = ['SDK.EmailEntry.ConfirmationEmailMissingError',
  'SDK.EmailEntry.ConfirmationEmailMismatchError',
  'SDK.EmailEntry.EmailFormatError'];

export class ActivityEmailValidatorRule extends ActivityAbstractValidationRule {
  private emailFormatErrorMessage: string;
  private confirmationEmailMismatchError: string;
  private confirmationEmailMissingError: string;

  constructor(
    question: ActivityEmailQuestionBlock, translate: NGXTranslateService) {
    super(question);
    translate.getTranslation(TRANSLATION_KEYS
    )
      .pipe(take(1))
      .subscribe((vals) => {
        this.confirmationEmailMissingError = vals[TRANSLATION_KEYS[0]];
        this.confirmationEmailMismatchError = vals[TRANSLATION_KEYS[1]];
        this.emailFormatErrorMessage = vals[TRANSLATION_KEYS[2]];
      })
  }

  recalculate(): boolean {
    this.result = null;
    const email = this.emailBlock().email;
    const confirmation = this.emailBlock().emailConfirmation;
    if (!email && !confirmation) {
      return true;
    } else if ((!email || !confirmation)) {
      // @todo internationalize messages
      this.result = this.confirmationEmailMissingError;
      return false;
    } else if (email !== confirmation) {
      this.result = this.confirmationEmailMismatchError;
      return false;
    } else if (!EMAIL_REGEXP.test(this.emailBlock().email) || !EMAIL_REGEXP.test(this.emailBlock().emailConfirmation)) {
      this.result = this.emailFormatErrorMessage;
      return false;
    } else {
      return true;
    }
  }

  private emailBlock(): ActivityEmailQuestionBlock {
    return this.question as ActivityEmailQuestionBlock;
  }

}
