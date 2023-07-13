import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpContactPhysicianPage extends AtcpPageBase {

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^3$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Contacting Physician');
  }

  get physicianFirstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_FIRSTNAME' });
  }

  get physicianLastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_LASTNAME' });
  }

  get physicianMailingAddress(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_MAIL' });
  }

  get physicianPhone(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_PHONE' });
  }
}
