import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import PageBase from 'lib/page-base';

export default class EnrollMyChildPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Question: How old is your child?
   */
  howOldIsYourChild(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ENROLLING_CHILD_AGE' });
  }

  /**
   * <br> Question: Does your child have a cognitive impairment that impacts their understanding of words commonly used by others in their age group?
   * <br> Type: Radiobutton
   */
  doesChildHaveCognitiveImpairment(): Question {
    return new Question(this.page, {
      prompt:
        'Does your child have a cognitive impairment that impacts their understanding of words commonly' +
        ' used by others in their age group?'
    });
  }

  /**
   * Question: Who in your child's family has single ventricle heart defect?
   */
  whoInChildFamilyHasVentricleHeartDefect(): Question {
    return new Question(this.page, {
      prompt: "Who in your child's family has single ventricle heart defect?"
    });
  }
}
