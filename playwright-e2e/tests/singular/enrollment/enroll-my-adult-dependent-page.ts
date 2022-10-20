import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import PageBase from 'lib/page-base';
import Input from '../../../lib/widget/Input';

export default class EnrollMyAdultDependentPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Question: How old is your dependent?
   */
  howOldIsYourDependent(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ENROLLING_DEPENDENT_AGE' });
  }

  /**
   * <br> Question: Does your dependent have a cognitive impairment that impacts their understanding of words commonly used by others in their age group?
   * <br> Type: Radiobutton
   */
  doesDependentHaveCognitiveImpairment(): Question {
    return new Question(this.page, {
      prompt:
        'Does your dependent have a cognitive impairment that impacts their understanding of words commonly' +
        ' used by others in their age group?'
    });
  }

  /**
   * <br> Question: Who in their family has single ventricle heart defect?
   * <br> Type: Checkbox
   */
  whoHasVentricleHeartDefect(): Question {
    return new Question(this.page, {
      prompt: 'Who in their family has single ventricle heart defect?'
    });
  }
}
