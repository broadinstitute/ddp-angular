import { Page } from '@playwright/test';
import Input from 'dss/component/input';
import { SingularPage } from 'dss/pages/singular/singular-page';

export default class AboutMyAdultDependentPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.firstName().toLocator().waitFor({ state: 'visible' });
  }

  firstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ABOUT_PATIENT_FIRST_NAME' });
  }
}
