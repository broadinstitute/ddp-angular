import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';
import Card from 'lib/widget/card';
import Input from 'lib/widget/Input';

export default class AboutMyChildPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    // Add additional checks to wait for page is ready
    await this.childFirstName()
      .toLocator()
      .waitFor({ state: 'visible', timeout: 60 * 1000 });
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
    return new Question(this.page, { prompt: "Your Child's Mailing Address:" });
  }

  suggestedAddress(): Card {
    return new Card(
      this.page,
      'We have checked your address entry and have suggested changes that could help ensure delivery'
    );
  }
}
