import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';
import Input from 'lib/widget/input';

export default class EnrollMyChildPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.howOldIsYourChild().toLocator().waitFor({ state: 'visible' });
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

  /**
   * <br> Question: Where does your child currently live?
   * <br> Type: Select Country
   */
  whereDoesChildLive(): Question {
    return new Question(this.page, {
      prompt: 'Where does your child currently live?'
    });
  }

  state(): Question {
    return new Question(this.page, { classAttr: 'picklist-answer-ADD_PARTICIPANT_STATE_CHILD' });
  }
}
