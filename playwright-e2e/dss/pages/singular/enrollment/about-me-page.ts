import { Locator, Page } from '@playwright/test';
import { SingularPage } from 'dss/pages/singular/singular-page';
import TextInput from 'dss/component/input';

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
