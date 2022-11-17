import { Locator, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/question';
import TextInput from 'lib/widget/input';
import Checkbox from 'lib/widget/checkbox';

export default class AboutMePage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.fullName().waitFor({ state: 'visible' });
  }

  firstName(): Question {
    return new Question(this.page, { prompt: 'Your First Name' });
  }

  lastName(): Question {
    return new Question(this.page, { prompt: 'Your Last Name' });
  }

  fullName(): Locator {
    return new TextInput(this.page, { label: 'Full Name' }).toLocator();
  }

  /**
   * <br> Question: We are unable to confirm that the address is valid. Please check this box to use the address as entered.
   * <br> Type: Checkbox
   */
  useAddressAsEntered(): Checkbox {
    return new Checkbox(this.page, {
      label: 'We are unable to confirm that the address is valid. Please check this box to use the address as entered.'
    });
  }
}
