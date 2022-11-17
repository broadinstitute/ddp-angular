import { expect, Page } from '@playwright/test';
import Question from 'lib/component/question';
import Input from 'lib/widget/input';
import { SingularPage } from 'pages/singular/singular-page';

export default class EnrollMyAdultDependentPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.howOldIsYourDependent().toLocator()).toBeVisible();
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
