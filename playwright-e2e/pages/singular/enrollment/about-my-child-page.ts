import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/question';
import Card from 'lib/widget/card';
import Input from 'lib/widget/input';

export default class AboutMyChildPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.childFirstName().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: Your Child's First Name
   * <br> Type: Input
   */
  childFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ABOUT_PATIENT_FIRST_NAME' });
  }

  /**
   * <br> Question: Your Child's Last Name
   * <br> Type: Input
   */
  childLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ABOUT_PATIENT_LAST_NAME' });
  }

  childMailingAddress(): Question {
    return new Question(this.page, { prompt: "Your Child's Mailing DdpAddress:" });
  }

  suggestedAddress(): Card {
    return new Card(this.page, 'We have checked your address entry and have suggested changes that could help ensure delivery');
  }
}
