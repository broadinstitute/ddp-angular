import { Locator, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';
import TextInput from 'lib/widget/input';
import Checkbox from 'lib/widget/checkbox';

export default class AboutMePage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.fullName().waitFor({ state: 'visible' });
  }

  fullName(): Locator {
    return new TextInput(this.page, { label: 'Full Name' }).toLocator();
  }
}
